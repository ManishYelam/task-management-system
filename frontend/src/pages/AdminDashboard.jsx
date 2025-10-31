import React, { useState, useEffect } from 'react'
import { tasksAPI, usersAPI } from '../services/api'
import Header from '../components/Common/Header'
import TaskForm from '../components/Admin/TaskForm'
import EmployeeForm from '../components/Admin/EmployeeForm'
import TaskList from '../components/Common/TaskList'

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [stats, setStats] = useState({})
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [tasksRes, employeesRes, statsRes] = await Promise.all([
        tasksAPI.getAll(),
        usersAPI.getEmployees(),
        tasksAPI.getStats()
      ])

      setTasks(tasksRes.data.data.tasks)
      setEmployees(employeesRes.data.data.employees)
      setStats(statsRes.data.data.stats)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const createTask = async (taskData) => {
    try {
      await tasksAPI.create(taskData)
      setShowTaskForm(false)
      fetchData()
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  const createEmployee = async (employeeData) => {
    try {
      await usersAPI.createEmployee(employeeData)
      setShowEmployeeForm(false)
      fetchData() // Refresh employees list
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await tasksAPI.delete(taskId)
      fetchData()
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  if (loading) {
    return <div className="loading">Loading Dashboard...</div>
  }

  return (
    <div>
      <Header />
      
      <div className="dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Tasks</h3>
            <p>{stats.total || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Pending</h3>
            <p>{stats.pending || 0}</p>
          </div>
          <div className="stat-card">
            <h3>In Progress</h3>
            <p>{stats.inProgress || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p>{stats.done || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Employees</h3>
            <p>{employees.length}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <button 
            className="btn"
            onClick={() => setShowTaskForm(true)}
          >
            Create New Task
          </button>
          <button 
            className="btn btn-success"
            onClick={() => setShowEmployeeForm(true)}
          >
            Add New Employee
          </button>
        </div>

        {/* Employee Management Section */}
        <div className="task-section">
          <h2>Employee Management ({employees.length} employees)</h2>
          <div className="employee-list" style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
            {employees.map(employee => (
              <div key={employee._id} className="task-card" style={{ borderLeftColor: '#3498db' }}>
                <h3>{employee.name}</h3>
                <div className="task-meta">
                  <span>Email: {employee.email}</span>
                  <span>Department: {employee.department}</span>
                  <span>Joined: {new Date(employee.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Management Section */}
        <TaskList 
          tasks={tasks} 
          onUpdate={fetchData}
          onDelete={deleteTask}
          isAdmin={true} 
        />

        {/* Modals */}
        {showTaskForm && (
          <TaskForm
            employees={employees}
            onSubmit={createTask}
            onCancel={() => setShowTaskForm(false)}
          />
        )}

        {showEmployeeForm && (
          <EmployeeForm
            onSubmit={createEmployee}
            onCancel={() => setShowEmployeeForm(false)}
          />
        )}
      </div>
    </div>
  )
}

export default AdminDashboard