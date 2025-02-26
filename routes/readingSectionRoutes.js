const express = require('express');
const router = express.Router();
const readingSectionController = require('../controllers/readingSectionController');

router.post('/', readingSectionController.createReadingSection);
router.put('/:id', readingSectionController.updateReadingSection);
router.get('/', readingSectionController.getAllReadingSections);
router.get('/:id', readingSectionController.getReadingSection);
router.delete('/:id', readingSectionController.deleteReadingSection);

module.exports = router;