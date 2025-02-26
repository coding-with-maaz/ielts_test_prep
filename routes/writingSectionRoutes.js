const express = require('express');
const router = express.Router();
const sectionController = require('../controllers/writingSectionController');

// Create a new writing section
router.post('/', sectionController.createWritingSection);

// Get all writing sections
router.get('/', sectionController.getAllWritingSections);

// Get a specific writing section by ID
router.get('/:id', sectionController.getWritingSection);

module.exports = router;
