import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const user = await login(formData.email, formData.password)
      if (user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/employee')
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password')
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Task Management System</h2>
        
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="demo-accounts">
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: admin@company.com / password</p>
          <p>Employee: employee@company.com / password</p>
        </div>
      </form>
    </div>
  )
}

export default Login