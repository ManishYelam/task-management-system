import React from 'react'
import { useAuth } from '../../context/AuthContext'

const Header = () => {
  const { user, logout } = useAuth()

  return (
    <div className="header">
      <h1>
        {user?.role === 'admin' ? 'Admin Dashboard' : 'Employee Dashboard'} - Task Management System
      </h1>
      <div className="user-info">
        <span>Welcome, {user?.name} ({user?.role})</span>
        <button className="btn btn-danger" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}

export default Header