import React, { useState } from 'react'
import TaskUpdateForm from '../Employee/TaskUpdateForm'

const TaskCard = ({ task, onUpdate, onDelete, isAdmin }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false)

  const handleStatusUpdate = async (newStatus) => {
    try {
      await onUpdate(task._id, { status: newStatus })
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await onDelete(task._id)
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  return (
    <>
      <div className={`task-card status-${task.status.toLowerCase().replace(' ', '-')}`}>
        <h3>{task.title}</h3>
        <p>{task.description}</p>
        
        <div className="task-meta">
          <span className={`priority-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
          <span>Status: {task.status}</span>
          <span>Progress: {task.progress}%</span>
          {task.dueDate && (
            <span>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {task.assignedTo && (
            <span>Assigned to: {task.assignedTo.name}</span>
          )}
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>

        <div className="task-actions">
          {!isAdmin && (
            <>
              <button 
                className="btn btn-success"
                onClick={() => handleStatusUpdate('In Progress')}
                disabled={task.status === 'In Progress'}
              >
                Start
              </button>
              <button 
                className="btn btn-success"
                onClick={() => handleStatusUpdate('Done')}
                disabled={task.status === 'Done'}
              >
                Complete
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setShowUpdateForm(true)}
              >
                Update Progress
              </button>
            </>
          )}
          {isAdmin && (
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {showUpdateForm && (
        <TaskUpdateForm
          task={task}
          onUpdate={onUpdate}
          onClose={() => setShowUpdateForm(false)}
        />
      )}
    </>
  )
}

export default TaskCard