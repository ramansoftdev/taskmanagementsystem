const {prisma} = require('../config/prisma');

const columnController = {
  // GET columns by board ID with tasks
  getColumnsByBoardId: async (req, res) => {
    try {
      const { boardId } = req.params;

      const columns = await prisma.column.findMany({
        where: { boardId: parseInt(boardId) },
        include: {
          tasks: {
            orderBy: { position: 'asc' }
          }
        },
        orderBy: { position: 'asc' }
      });

      res.json(columns);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST create column
  createColumn: async (req, res) => {
    try {
      const { boardId } = req.params;
      const { title, position } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // If position not provided, add to end
      let finalPosition = position;
      if (finalPosition === undefined) {
        const columnCount = await prisma.column.count({
          where: { boardId: parseInt(boardId) }
        });
        finalPosition = columnCount;
      }

      const column = await prisma.column.create({
        data: {
          boardId: parseInt(boardId),
          title,
          position: finalPosition
        }
      });

      res.status(201).json(column);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PUT update column
  updateColumn: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, position } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (position !== undefined) updateData.position = position;

      const column = await prisma.column.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      res.json(column);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Column not found' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE column
  deleteColumn: async (req, res) => {
    try {
      const { id } = req.params;

      const column = await prisma.column.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: 'Column deleted successfully', column });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Column not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = columnController;