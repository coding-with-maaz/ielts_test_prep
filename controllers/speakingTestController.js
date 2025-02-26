const SpeakingTest = require('../models/SpeakingTest');
const fs = require('fs');
const path = require('path');

// Create a new speaking test
exports.createSpeakingTest = async (req, res) => {
  try {
    const audioUrls = {};

    // Handle uploaded files (audio for each section)
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        const file = req.files[key][0];
        audioUrls[key] = `/uploads/audio/${file.filename}`;
      });
    }

    const speakingTest = new SpeakingTest({
      ...req.body,
      audioUrls: new Map(Object.entries(audioUrls)),
    });

    await speakingTest.save();
    res.status(201).json(speakingTest);
  } catch (error) {
    // Clean up uploaded files if test creation fails
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
    }
    res.status(400).json({ message: error.message });
  }
};

// Get all speaking tests
exports.getAllSpeakingTests = async (req, res) => {
  try {
    const speakingTests = await SpeakingTest.find().populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    res.json(speakingTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific speaking test by ID
exports.getSpeakingTest = async (req, res) => {
  try {
    const speakingTest = await SpeakingTest.findById(req.params.id).populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    if (!speakingTest) {
      return res.status(404).json({ message: 'Speaking Test not found' });
    }
    res.json(speakingTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit a speaking test (additional logic can be added for grading)
exports.submitSpeakingTest = async (req, res) => {
  try {
    // Logic for submitting the speaking test (e.g., marking or grading)
    res.json({ message: 'Test submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
