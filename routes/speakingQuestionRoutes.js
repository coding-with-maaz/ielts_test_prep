const express = require('express');
const router = express.Router();
const speakingQuestionController = require('../controllers/speakingQuestionController');
const { audioUpload } = require('../middleware/upload'); // Import the audio upload middleware

// Create a new speaking question (with audio file and transcript upload)
router.post('/', audioUpload.single('audio'), speakingQuestionController.createSpeakingQuestion);

// Get all speaking questions
router.get('/', speakingQuestionController.getAllSpeakingQuestions);

// Get a specific speaking question by ID
router.get('/:id', speakingQuestionController.getSpeakingQuestion);

// Update a specific speaking question's audio and transcript
router.patch('/:id/audio', audioUpload.single('audio'), speakingQuestionController.updateSpeakingQuestion);

// Delete a specific speaking question by ID
router.delete('/:id', speakingQuestionController.deleteSpeakingQuestion);

module.exports = router;
