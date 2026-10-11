import { useState } from 'react'
import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
        <BrowserRouter>
           <Routes>
             <Route path="/" element={<Login />} />
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/login" element={<Login />} />
           </Routes>
        </BrowserRouter>
  )
}

export default App
