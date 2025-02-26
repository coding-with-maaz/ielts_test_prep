const express = require('express');
const router = express.Router();
const speakingSectionController = require('../controllers/speakingSectionController');

// Create a new speaking section
router.post('/', speakingSectionController.createSpeakingSection);

// Get all speaking sections
router.get('/', speakingSectionController.getAllSpeakingSections);

// Get a specific speaking section by ID
router.get('/:id', speakingSectionController.getSpeakingSection);

module.exports = router;
