import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import '../styles/Sidebar.css';

function Sidebar({ boards, selectedBoard, onSelectBoard, onCreateBoard, onUpdateBoard, onDeleteBoard }) {
  const { theme, toggleTheme } = useTheme();
  const [showNewBoard, setShowNewBoard] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState('');
  const [editingBoard, setEditingBoard] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (newBoardTitle.trim()) {
      await onCreateBoard({ title: newBoardTitle, description: '' });
      setNewBoardTitle('');
      setShowNewBoard(false);
    }
  };

  const handleDeleteBoard = (e, boardId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this board? All columns and tasks will be deleted.')) {
      onDeleteBoard(boardId);
    }
  };

  const handleEditBoard = (e, board) => {
    e.stopPropagation();
    setEditingBoard(board.id);
    setEditTitle(board.title);
  };

  const handleUpdateBoard = async (e, boardId) => {
    e.preventDefault();
    e.stopPropagation();
    if (editTitle.trim()) {
      await onUpdateBoard(boardId, { title: editTitle, description: '' });
      setEditingBoard(null);
    }
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingBoard(null);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🎯 kanban</h2>
      </div>

      <div className="sidebar-content">
        <div className="boards-header">
          <span>ALL BOARDS ({boards.length})</span>
        </div>

        <div className="boards-list">
          {boards.map((board) => (
            <div key={board.id}>
              {editingBoard === board.id ? (
                <form 
                  onSubmit={(e) => handleUpdateBoard(e, board.id)} 
                  className="edit-board-form"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                  <div className="form-buttons">
                    <button type="submit">Save</button>
                    <button type="button" onClick={handleCancelEdit}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  className={`board-item ${selectedBoard?.id === board.id ? 'active' : ''}`}
                  onClick={() => onSelectBoard(board)}
                >
                  <div className="board-item-content">
                    <span className="board-icon">📋</span>
                    <span className="board-title">{board.title}</span>
                  </div>
                  <div className="board-actions">
                    <button 
                      onClick={(e) => handleEditBoard(e, board)}
                      className="btn-edit-small"
                      title="Edit board"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={(e) => handleDeleteBoard(e, board.id)}
                      className="btn-delete-small"
                      title="Delete board"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {showNewBoard ? (
            <form onSubmit={handleCreateBoard} className="new-board-form">
              <input
                type="text"
                placeholder="Board name..."
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                autoFocus
              />
              <div className="form-buttons">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowNewBoard(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div
              className="board-item create-new"
              onClick={() => setShowNewBoard(true)}
            >
              <span className="board-icon">+</span>
              <span>Create New Board</span>
            </div>
          )}
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="sidebar-footer">
        <div className="theme-toggle">
          <span className="theme-icon">☀️</span>
          <label className="toggle-switch">
            <input 
              type="checkbox" 
              checked={theme === 'dark'}
              onChange={toggleTheme}
            />
            <span className="slider"></span>
          </label>
          <span className="theme-icon">🌙</span>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;