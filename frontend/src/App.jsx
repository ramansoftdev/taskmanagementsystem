import { useState, useEffect } from 'react';
import { boardAPI, columnAPI, taskAPI } from './services/api';
import Sidebar from './components/Sidebar';
import Board from './components/Board';
import './App.css';

function App() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      fetchColumns(selectedBoard.id);
    }
  }, [selectedBoard]);

  const fetchBoards = async () => {
    try {
      const response = await boardAPI.getAll();
      setBoards(response.data);
      if (response.data.length > 0 && !selectedBoard) {
        setSelectedBoard(response.data[0]);
      }
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchColumns = async (boardId) => {
    try {
      const response = await columnAPI.getByBoardId(boardId);
      setColumns(response.data);
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  const handleCreateBoard = async (data) => {
    try {
      const response = await boardAPI.create(data);
      setBoards([...boards, response.data]);
      setSelectedBoard(response.data);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleUpdateBoard = async (boardId, data) => {
    try {
      const response = await boardAPI.update(boardId, data);
      setBoards(boards.map(board => 
        board.id === boardId ? response.data : board
      ));
      if (selectedBoard?.id === boardId) {
        setSelectedBoard(response.data);
      }
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      await boardAPI.delete(boardId);
      const updatedBoards = boards.filter(board => board.id !== boardId);
      setBoards(updatedBoards);
      
      if (selectedBoard?.id === boardId) {
        setSelectedBoard(updatedBoards.length > 0 ? updatedBoards[0] : null);
        setColumns([]);
      }
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const handleCreateColumn = async (boardId, data) => {
    try {
      const response = await columnAPI.create(boardId, data);
      setColumns([...columns, { ...response.data, tasks: [] }]);
    } catch (error) {
      console.error('Error creating column:', error);
    }
  };

  const handleUpdateColumn = async (columnId, data) => {
    try {
      const response = await columnAPI.update(columnId, data);
      setColumns(columns.map(col => 
        col.id === columnId ? { ...response.data, tasks: col.tasks } : col
      ));
    } catch (error) {
      console.error('Error updating column:', error);
    }
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      await columnAPI.delete(columnId);
      setColumns(columns.filter(col => col.id !== columnId));
    } catch (error) {
      console.error('Error deleting column:', error);
    }
  };

  const handleCreateTask = async (columnId, data) => {
    try {
      const response = await taskAPI.create(columnId, data);
      setColumns(columns.map(col => 
        col.id === columnId 
          ? { ...col, tasks: [...(col.tasks || []), response.data] }
          : col
      ));
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskId, data) => {
    try {
      const response = await taskAPI.update(taskId, data);
      setColumns(columns.map(col => ({
        ...col,
        tasks: col.tasks?.map(task => 
          task.id === taskId ? response.data : task
        ) || []
      })));
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.delete(taskId);
      setColumns(columns.map(col => ({
        ...col,
        tasks: col.tasks?.filter(task => task.id !== taskId) || []
      })));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="app">
      <Sidebar
        boards={boards}
        selectedBoard={selectedBoard}
        onSelectBoard={setSelectedBoard}
        onCreateBoard={handleCreateBoard}
        onUpdateBoard={handleUpdateBoard}
        onDeleteBoard={handleDeleteBoard}
      />
      <Board
        board={selectedBoard}
        columns={columns}
        onCreateColumn={handleCreateColumn}
        onUpdateColumn={handleUpdateColumn}
        onDeleteColumn={handleDeleteColumn}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
}

export default App;