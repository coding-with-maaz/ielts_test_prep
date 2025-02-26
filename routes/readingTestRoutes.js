const express = require('express');
const router = express.Router();
const readingTestController = require('../controllers/readingTestController');

router.post('/', readingTestController.createReadingTest);
router.put('/:id', readingTestController.updateReadingTest);
router.get('/', readingTestController.getAllReadingTests);
router.get('/:id', readingTestController.getReadingTest);
router.delete('/:id', readingTestController.deleteReadingTest);
router.post('/:id/submit', readingTestController.submitReadingTest);

module.exports = router;