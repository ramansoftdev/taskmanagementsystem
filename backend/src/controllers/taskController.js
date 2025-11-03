const {prisma} = require('../config/prisma');

const taskController = {
  // GET tasks by column ID
  getTasksByColumnId: async (req, res) => {
    try {
      const { columnId } = req.params;

      const tasks = await prisma.task.findMany({
        where: { columnId: parseInt(columnId) },
        orderBy: { position: 'asc' }
      });

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // POST create task
  createTask: async (req, res) => {
    try {
      const { columnId } = req.params;
      const { title, description, position } = req.body;

      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }

      // If position not provided, add to end
      let finalPosition = position;
      if (finalPosition === undefined) {
        const taskCount = await prisma.task.count({
          where: { columnId: parseInt(columnId) }
        });
        finalPosition = taskCount;
      }

      const task = await prisma.task.create({
        data: {
          columnId: parseInt(columnId),
          title,
          description: description || '',
          position: finalPosition
        }
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // PUT update task
  updateTask: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, position, columnId } = req.body;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (position !== undefined) updateData.position = position;
      if (columnId !== undefined) updateData.columnId = parseInt(columnId);

      const task = await prisma.task.update({
        where: { id: parseInt(id) },
        data: updateData
      });

      res.json(task);
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // DELETE task
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;

      const task = await prisma.task.delete({
        where: { id: parseInt(id) }
      });

      res.json({ message: 'Task deleted successfully', task });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = taskController;