import React, { useState } from 'react'

const EmployeeForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Development'
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Error creating employee:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData({
      ...formData,
      password: password
    })
  }

  const departments = [
    'Development',
    'Design',
    'QA',
    'Marketing',
    'Sales',
    'HR',
    'Finance',
    'Operations',
    'Support'
  ]

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Add New Employee</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter employee's full name"
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter employee's email"
            />
          </div>

          <div className="form-group">
            <label>Department *</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>
              Password *
              <button 
                type="button"
                onClick={generateRandomPassword}
                style={{
                  marginLeft: '10px',
                  padding: '5px 10px',
                  fontSize: '12px',
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Generate Secure Password
              </button>
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Enter password or generate one"
                style={{ flex: 1 }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  padding: '5px 10px',
                  background: 'transparent',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {formData.password && (
              <div style={{ 
                marginTop: '5px', 
                fontSize: '12px', 
                color: '#666',
                background: '#f8f9fa',
                padding: '5px',
                borderRadius: '4px'
              }}>
                <strong>Password:</strong> {formData.password}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Employee'}
            </button>
          </div>

          <div style={{ 
            marginTop: '1rem', 
            padding: '1rem', 
            background: '#e8f4fd', 
            borderRadius: '5px',
            fontSize: '0.9rem',
            color: '#2c3e50'
          }}>
            <strong>Note:</strong> The employee will use this email and password to login. 
            Make sure to provide them with their credentials securely.
          </div>
        </form>
      </div>
    </div>
  )
}

export default EmployeeForm