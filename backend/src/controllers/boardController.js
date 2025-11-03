const {prisma} = require('../config/prisma');

const boardController = {
  // GET all boards
  getAllBoards: async (req, res) => {
    try {
      const boards = await prisma.board.findMany({
        orderBy: { createdAt: 'desc' }
      });
      res.json(boards);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // GET board by ID with columns and tasks
  getBoardById: async (req, res) => {
    try {
      const { id } = req.params;
      
      const board = await prisma.board.findUnique({
        where: { id: parseInt(id) },
        include: {
          columns: {
            orderBy: { position: 'asc' },
            include: {
              tasks: {
                orderBy: { position: 'asc' }
              }
            }
          }
        }
      });

      if (!board) {
        return res.status(404).json({ error: 'Board not found' });
      }

      res.json(board);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST create board
  createBoard: async (req, res) => {
    try {
      const { title, description } = req.body;

      console.log("title and description" ,title, description);

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const board = await prisma.board.create({
        data: {
          title,
          description: description || ''
        }
      });

      res.status(201).json(board);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PUT update board
  updateBoard: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      const board = await prisma.board.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description: description || ''
        }
      });

      res.json(board);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Board not found' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE board
  deleteBoard: async (req, res) => {
    try {
      const { id } = req.params;

      const board = await prisma.board.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: 'Board deleted successfully', board });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Board not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = boardController;