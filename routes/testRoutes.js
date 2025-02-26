const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { audioUpload } = require('../middleware/upload');

// Configure upload fields for the four sections
const sectionAudioFields = [
  { name: 'section1', maxCount: 1 },
  { name: 'section2', maxCount: 1 },
  { name: 'section3', maxCount: 1 },
  { name: 'section4', maxCount: 1 }
];

router.post('/', audioUpload.fields(sectionAudioFields), testController.createTest);
router.patch('/:id/audio', audioUpload.fields(sectionAudioFields), testController.updateTestAudio);
router.get('/', testController.getAllTests);
router.get('/:id', testController.getTest);
router.post('/:id/submit', testController.submitTest);

module.exports = router;