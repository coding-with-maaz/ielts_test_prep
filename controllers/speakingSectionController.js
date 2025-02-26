const SpeakingSection = require('../models/SpeakingSection');

// Create a new speaking section
exports.createSpeakingSection = async (req, res) => {
  try {
    const speakingSection = new SpeakingSection(req.body);
    await speakingSection.save();
    res.status(201).json(speakingSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all speaking sections
exports.getAllSpeakingSections = async (req, res) => {
  try {
    const speakingSections = await SpeakingSection.find().populate('questions');
    res.json(speakingSections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a specific speaking section by ID
exports.getSpeakingSection = async (req, res) => {
  try {
    const speakingSection = await SpeakingSection.findById(req.params.id).populate('questions');
    if (!speakingSection) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(speakingSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
