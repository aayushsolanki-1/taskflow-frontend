import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Dashboard({ token, onLogout }) {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [dueDate, setDueDate] = useState('')

  const headers = { Authorization: `Bearer ${token}` }

  const fetchTasks = async () => {
    const res = await axios.get('https://taskflow-production-7b10.up.railway.app/api/tasks', { headers })
    setTasks(res.data)
  }

  useEffect(() => { fetchTasks() }, [])

  const suggestPriority = async () => {
    if (!title) return
    try {
      const res = await axios.post('https://taskflow-production-7b10.up.railway.app/api/ai/suggest-priority', 
        { title, description }, 
        { headers }
      )
      setPriority(res.data.priority)
    } catch (err) {
      console.error('AI suggestion failed', err)
    }
  }

  const createTask = async () => {
    if (!title) return
    await axios.post('https://taskflow-production-7b10.up.railway.app/api/tasks', { title, description, priority, dueDate }, { headers })
    setTitle('')
    setDescription('')
    setDueDate('')
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await axios.delete(`https://taskflow-production-7b10.up.railway.app/api/tasks/${id}`, { headers })
    fetchTasks()
  }

  const toggleComplete = async (task) => {
    await axios.put(`https://taskflow-production-7b10.up.railway.app/api/tasks/${task.id}`, { ...task, completed: !task.completed }, { headers })
    fetchTasks()
  }

  const priorityColor = (p) => {
    if (p === 'HIGH') return 'text-red-400'
    if (p === 'MEDIUM') return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">TaskFlow</h1>
          <button onClick={onLogout} className="text-gray-400 hover:text-white transition">Logout</button>
        </div>

        {/* Create Task */}
        <div className="bg-gray-900 p-6 rounded-2xl mb-6">
          <h2 className="text-lg font-semibold mb-4">New Task</h2>
          <input
            className="w-full bg-gray-800 rounded-lg px-4 py-3 mb-3 outline-none"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <input
            className="w-full bg-gray-800 rounded-lg px-4 py-3 mb-3 outline-none"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="flex gap-3 mb-4">
            <select
              className="bg-gray-800 rounded-lg px-4 py-3 outline-none flex-1"
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
              <button
              onClick={suggestPriority}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition text-sm font-semibold"
              >
                ✨ AI
            </button>
            <input
              type="date"
              className="bg-gray-800 rounded-lg px-4 py-3 outline-none flex-1"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
          <button
            onClick={createTask}
            className="w-full bg-blue-600 hover:bg-blue-700 font-semibold py-3 rounded-lg transition"
          >
            Add Task
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 && <p className="text-gray-500 text-center">No tasks yet.</p>}
          {tasks.map(task => (
            <div key={task.id} className="bg-gray-900 p-4 rounded-xl flex items-start justify-between">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task)}
                  className="mt-1 cursor-pointer"
                />
                <div>
                  <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</p>
                  {task.description && <p className="text-gray-400 text-sm">{task.description}</p>}
                  <div className="flex gap-3 mt-1">
                    <span className={`text-xs font-semibold ${priorityColor(task.priority)}`}>{task.priority}</span>
                    {task.dueDate && <span className="text-xs text-gray-500">{task.dueDate}</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-gray-600 hover:text-red-400 transition ml-4">✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}