const SpeakingQuestion = require('../models/SpeakingQuestion');
const fs = require('fs');
const path = require('path');

// Create a new speaking question (with audio file and transcript upload)
exports.createSpeakingQuestion = async (req, res) => {
  try {
    let audioUrl = null;
    if (req.file) {
      audioUrl = `/uploads/audio/${req.file.filename}`;
    }

    const speakingQuestion = new SpeakingQuestion({
      ...req.body,
      audioUrl,
    });

    await speakingQuestion.save();
    res.status(201).json(speakingQuestion);
  } catch (error) {
    // Clean up uploaded file if question creation fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
};

// Get all speaking questions
exports.getAllSpeakingQuestions = async (req, res) => {
  try {
    const speakingQuestions = await SpeakingQuestion.find();
    res.json(speakingQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific speaking question by ID
exports.getSpeakingQuestion = async (req, res) => {
  try {
    const speakingQuestion = await SpeakingQuestion.findById(req.params.id);
    if (!speakingQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(speakingQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a specific speaking question's audio and transcript
exports.updateSpeakingQuestion = async (req, res) => {
  try {
    const speakingQuestion = await SpeakingQuestion.findById(req.params.id);
    if (!speakingQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    let audioUrl = speakingQuestion.audioUrl;
    if (req.file) {
      audioUrl = `/uploads/audio/${req.file.filename}`;
    }

    speakingQuestion.audioUrl = audioUrl;
    speakingQuestion.transcript = req.body.transcript;
    speakingQuestion.examinerTranscript = req.body.examinerTranscript;
    speakingQuestion.candidateTranscript = req.body.candidateTranscript;

    await speakingQuestion.save();
    res.json(speakingQuestion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a specific speaking question by ID
exports.deleteSpeakingQuestion = async (req, res) => {
  try {
    const speakingQuestion = await SpeakingQuestion.findById(req.params.id);
    if (!speakingQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Delete the audio file if it exists
    if (speakingQuestion.audioUrl) {
      const filePath = path.join(__dirname, '..', speakingQuestion.audioUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await SpeakingQuestion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
