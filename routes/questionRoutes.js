const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { diagramUpload } = require('../middleware/upload');

router.post('/', diagramUpload.single('diagram'), questionController.createQuestion);
router.patch('/:id/diagram', diagramUpload.single('diagram'), questionController.updateQuestionDiagram);
router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestion);
router.delete('/:id', questionController.deleteQuestion);

module.exports = router;