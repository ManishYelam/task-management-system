import React from 'react'
import TaskCard from './TaskCard'

const TaskList = ({ tasks, onUpdate, onDelete, isAdmin }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="task-section">
        <h2>Tasks</h2>
        <p>No tasks found.</p>
      </div>
    )
  }

  return (
    <div className="task-section">
      <h2>Tasks ({tasks.length})</h2>
      <div className="task-list">
        {tasks.map(task => (
          <TaskCard
            key={task._id}
            task={task}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </div>
  )
}

export default TaskList