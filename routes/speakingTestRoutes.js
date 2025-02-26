const express = require('express');
const router = express.Router();
const speakingTestController = require('../controllers/speakingTestController');
const { audioUpload } = require('../middleware/upload'); // Import the audio upload middleware

// Configure upload fields for the sections
const sectionAudioFields = [
  { name: 'section1', maxCount: 1 },
  { name: 'section2', maxCount: 1 },
  { name: 'section3', maxCount: 1 }
];

// Create a new speaking test (with audio uploads for each section)
router.post('/', audioUpload.fields(sectionAudioFields), speakingTestController.createSpeakingTest);

// Get all speaking tests
router.get('/', speakingTestController.getAllSpeakingTests);

// Get a specific speaking test by ID
router.get('/:id', speakingTestController.getSpeakingTest);

// Submit a specific speaking test
router.post('/:id/submit', speakingTestController.submitSpeakingTest);

module.exports = router;
