const express = require('express');
const router = express.Router();
const columnController = require('../controllers/columnController');

router.get('/board/:boardId', columnController.getColumnsByBoardId);
router.post('/board/:boardId', columnController.createColumn);
router.put('/:id', columnController.updateColumn);
router.delete('/:id', columnController.deleteColumn);

module.exports = router;