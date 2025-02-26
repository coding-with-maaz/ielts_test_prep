const WritingSection = require('../models/WritingSection');

exports.createWritingSection = async (req, res) => {
  try {
    const writingSection = new WritingSection(req.body);
    await writingSection.save();
    res.status(201).json(writingSection);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllWritingSections = async (req, res) => {
  try {
    const writingSections = await WritingSection.find().populate('questions');
    res.json(writingSections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWritingSection = async (req, res) => {
  try {
    const writingSection = await WritingSection.findById(req.params.id).populate('questions');
    if (!writingSection) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(writingSection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
