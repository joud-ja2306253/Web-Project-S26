// app/components/LoginForm.jsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    if (!email || !password) {
      setMessage('Please fill all fields')
      setLoading(false)
      return
    }

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()
    if (response.ok) {
      localStorage.setItem('currentUser', data.userId)
      window.location.href = '/profile'
    } else {
      setMessage(data.error)
    }
    setLoading(false)
  }

  return (
    <div className="form-container">
      <h2 className="h2F">Login</h2>
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldsetF">
          <legend className="legendF">Login</legend>

          <label className="labelF" htmlFor="email">
            Email<span className="requiredF"> *</span>
          </label>
          <input
            className="inputF"
            id="email"
            type="email"
            placeholder="Enter Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label className="labelF" htmlFor="password">
            Password<span className="requiredF"> *</span>
          </label>
          <input
            className="inputF"
            id="password"
            type="password"
            placeholder="Enter Your Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </fieldset>

        <button className="buttonF" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        
        {message && <p style={{ fontSize: '0.9rem', color: 'red' }}>{message}</p>}
        
        <p className="switch">
          Don't have an account? <Link href="/auth/register">Register</Link>
        </p>
      </form>
    </div>
  )
}