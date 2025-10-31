import React, { useState, useEffect } from 'react'
import { tasksAPI } from '../services/api'
import Header from '../components/Common/Header'
import TaskList from '../components/Common/TaskList'

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [stats, setStats] = useState({})
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterTasks()
  }, [tasks, filter])

  const fetchData = async () => {
    try {
      const [tasksRes, statsRes] = await Promise.all([
        tasksAPI.getAll(),
        tasksAPI.getStats()
      ])

      setTasks(tasksRes.data.data.tasks)
      setStats(statsRes.data.data.stats)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterTasks = () => {
    if (filter === 'all') {
      setFilteredTasks(tasks)
    } else {
      setFilteredTasks(tasks.filter(task => task.status === filter))
    }
  }

  const updateTask = async (taskId, updates) => {
    try {
      await tasksAPI.update(taskId, updates)
      fetchData()
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const handleFilter = (status) => {
    setFilter(status)
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
            <h3>My Tasks</h3>
            <p>{stats.total || 0}</p>
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
            <h3>Overall Progress</h3>
            <p>{Math.round(stats.overallProgress || 0)}%</p>
          </div>
        </div>

        <div className="filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${filter === 'Pending' ? 'active' : ''}`}
            onClick={() => handleFilter('Pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'In Progress' ? 'active' : ''}`}
            onClick={() => handleFilter('In Progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${filter === 'Done' ? 'active' : ''}`}
            onClick={() => handleFilter('Done')}
          >
            Done
          </button>
        </div>

        <TaskList 
          tasks={filteredTasks} 
          onUpdate={updateTask}
          isAdmin={false} 
        />
      </div>
    </div>
  )
}

export default EmployeeDashboard