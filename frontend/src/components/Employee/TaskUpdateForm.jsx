import React, { useState } from 'react'

const TaskUpdateForm = ({ task, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    progress: task.progress,
    description: task.description
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await onUpdate(task._id, formData)
      onClose()
    } catch (error) {
      console.error('Error updating task:', error)
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

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Update Task Progress</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Progress (%)</label>
            <input
              type="number"
              name="progress"
              min="0"
              max="100"
              value={formData.progress}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskUpdateForm