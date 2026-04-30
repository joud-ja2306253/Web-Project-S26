// app/components/RegisterForm.jsx
'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    Uname: '',
    email: '',
    password: '',
    conf_password: ''
  })
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    const { fname, lname, Uname, email, password, conf_password } = formData

    if (!fname || !lname || !Uname || !email || !password || !conf_password) {
      setMessage('Please fill all fields')
      setLoading(false)
      return
    }

    if (password !== conf_password) {
      setMessage('Password does not match!')
      setLoading(false)
      return
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: fname,
        lastName: lname,
        username: Uname,
        email,
        password
      })
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
      <h2 className="h2F">Registration</h2>
      <form onSubmit={handleSubmit}>
        <fieldset className="fieldsetF">
          <legend className="legendF">Create Account</legend>

          <label className="labelF" htmlFor="fname">
            First Name<span className="requiredF"> *</span>
          </label>
          <input
            className="inputF"
            id="fname"
            type="text"
            placeholder="Enter Your First Name"
            required
            onChange={handleChange}
          />

          <label className="labelF" htmlFor="lname">
            Last Name<span className="requiredF"> *</span>
          </label>
          <input
            className="inputF"
            id="lname"
            type="text"
            placeholder="Enter Your Last Name"
            required
            onChange={handleChange}
          />

          <label className="labelF" htmlFor="Uname">
            User Name<span className="requiredF"> *</span>
          </label>
          <input
            className="inputF"
            id="Uname"
            type="text"
            placeholder="Enter Your User Name"
            required
            onChange={handleChange}
          />

          <label className="labelF" htmlFor="email">
            Email<span className="requiredF"> *</span>
          </label>
          <input
            className="inputF"
            id="email"
            type="email"
            placeholder="Enter Your Email"
            required
            onChange={handleChange}
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
            onChange={handleChange}
          />

          <label className="labelF" htmlFor="conf_password">
            Confirm Password<span className="requiredF"> *</span>
          </label>
          <input
            className="inputF"
            id="conf_password"
            type="password"
            placeholder="Enter Your Password Again"
            required
            onChange={handleChange}
          />
        </fieldset>

        <button className="buttonF" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        {message && <p style={{ fontSize: '0.9rem', color: 'red' }}>{message}</p>}

        <p className="switch">
          Already have an account? <Link href="/auth/login">Login</Link>
        </p>
      </form>
    </div>
  )
}