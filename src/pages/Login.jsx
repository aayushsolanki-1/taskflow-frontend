import { useState } from 'react'
import axios from 'axios'

export default function Login({ onSwitch, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    try {
      const res = await axios.post('https://taskflow-production-7b10.up.railway.app/api/auth/login', { email, password })
      onLogin(res.data.token)
    } catch (err) {
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-2xl w-full max-w-md shadow-xl">
        <h1 className="text-white text-3xl font-bold mb-2">TaskFlow</h1>
        <p className="text-gray-400 mb-6">Sign in to your account</p>

        {error && <p className="text-red-400 mb-4">{error}</p>}

        <input
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-3 outline-none"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 mb-6 outline-none"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Sign In
        </button>
        <p className="text-gray-400 text-center mt-4">
          No account?{' '}
          <span onClick={onSwitch} className="text-blue-400 cursor-pointer hover:underline">
            Register
          </span>
        </p>
      </div>
    </div>
  )
}