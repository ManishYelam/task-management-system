import React, { useState, useEffect } from 'react'
import { tasksAPI, usersAPI } from '../services/api'
import Header from '../components/Common/Header'
import TaskForm from '../components/Admin/TaskForm'
import TaskList from '../components/Common/TaskList'

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [employees, setEmployees] = useState([])
  const [stats, setStats] = useState({})
  const [showForm, setShowForm] = useState(false)
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
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Error creating task:', error)
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
        </div>

        <button 
          className="btn"
          onClick={() => setShowForm(true)}
          style={{ marginBottom: '2rem' }}
        >
          Create New Task
        </button>

        {showForm && (
          <TaskForm
            employees={employees}
            onSubmit={createTask}
            onCancel={() => setShowForm(false)}
          />
        )}

        <TaskList 
          tasks={tasks} 
          onUpdate={fetchData}
          onDelete={deleteTask}
          isAdmin={true} 
        />
      </div>
    </div>
  )
}

export default AdminDashboard