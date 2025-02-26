const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/sectionController');

router.post('/', sectionController.createSection);
router.get('/', sectionController.getAllSections);
router.get('/:id', sectionController.getSection);

module.exports = router;