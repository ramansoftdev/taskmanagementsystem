import { useState } from 'react';
import Column from './Column';
import '../styles/Board.css';

function Board({ board, columns, onCreateColumn, onUpdateColumn, onDeleteColumn, onCreateTask, onUpdateTask, onDeleteTask }) {
  const [showNewColumn, setShowNewColumn] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState('');

  const handleCreateColumn = async (e) => {
    e.preventDefault();
    if (newColumnTitle.trim()) {
      await onCreateColumn(board.id, { title: newColumnTitle });
      setNewColumnTitle('');
      setShowNewColumn(false);
    }
  };

  if (!board) {
    return (
      <div className="board-empty">
        <h2>👈 Select a board to get started</h2>
        <p>or create a new one from the sidebar</p>
      </div>
    );
  }

  return (
    <div className="board">
      <div className="board-header">
        <h1>{board.title}</h1>
      </div>

      <div className="board-columns">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            onUpdateColumn={onUpdateColumn}
            onDeleteColumn={onDeleteColumn}
            onCreateTask={onCreateTask}
            onUpdateTask={onUpdateTask}
            onDeleteTask={onDeleteTask}
          />
        ))}

        {showNewColumn ? (
          <div className="new-column">
            <form onSubmit={handleCreateColumn}>
              <input
                type="text"
                placeholder="Column name..."
                value={newColumnTitle}
                onChange={(e) => setNewColumnTitle(e.target.value)}
                autoFocus
              />
              <div className="form-buttons">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowNewColumn(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="new-column-btn" onClick={() => setShowNewColumn(true)}>
            <span>+ New Column</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Board;