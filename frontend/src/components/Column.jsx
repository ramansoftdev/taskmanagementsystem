import { useState } from 'react';
import Task from './Task';
import '../styles/Column.css';

function Column({ column, onUpdateColumn, onDeleteColumn, onCreateTask, onUpdateTask, onDeleteTask }) {
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      await onCreateTask(column.id, { title: newTaskTitle, description: '' });
      setNewTaskTitle('');
      setShowNewTask(false);
    }
  };

  const handleUpdateColumn = async (e) => {
    e.preventDefault();
    if (editTitle.trim()) {
      await onUpdateColumn(column.id, { title: editTitle });
      setIsEditing(false);
    }
  };

  const handleDeleteColumn = () => {
    if (window.confirm(`Delete column "${column.title}" and all its tasks?`)) {
      onDeleteColumn(column.id);
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        {isEditing ? (
          <form onSubmit={handleUpdateColumn} className="edit-column-form">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              autoFocus
            />
            <div className="form-buttons-inline">
              <button type="submit">✓</button>
              <button type="button" onClick={() => setIsEditing(false)}>✕</button>
            </div>
          </form>
        ) : (
          <div className="column-title-wrapper">
            <div className="column-title">
              <span className="column-dot"></span>
              <h3>{column.title} ({column.tasks?.length || 0})</h3>
            </div>
            <div className="column-actions">
              <button onClick={() => setIsEditing(true)} title="Edit column">✏️</button>
              <button onClick={handleDeleteColumn} title="Delete column">🗑️</button>
            </div>
          </div>
        )}
      </div>

      <div className="tasks-list">
        {column.tasks?.map((task) => (
          <Task
            key={task.id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
          />
        ))}

        {showNewTask ? (
          <form onSubmit={handleCreateTask} className="new-task-form">
            <input
              type="text"
              placeholder="Task title..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              autoFocus
            />
            <div className="form-buttons">
              <button type="submit">Add</button>
              <button type="button" onClick={() => setShowNewTask(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button className="add-task-btn" onClick={() => setShowNewTask(true)}>
            + Add Task
          </button>
        )}
      </div>
    </div>
  );
}

export default Column;