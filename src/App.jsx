import { useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  const [page, setPage] = useState('login')
  const [token, setToken] = useState(null)

  if (token) return <Dashboard token={token} onLogout={() => setToken(null)} />
  if (page === 'register') return <Register onSwitch={() => setPage('login')} />
  return <Login onSwitch={() => setPage('register')} onLogin={setToken} />
}

export default App