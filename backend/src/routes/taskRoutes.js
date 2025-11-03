const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/column/:columnId', taskController.getTasksByColumnId);
router.post('/column/:columnId', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;