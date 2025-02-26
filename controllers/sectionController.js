const Section = require('../models/Section');

exports.createSection = async (req, res) => {
  try {
    const section = new Section(req.body);
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.find().populate('questions');
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSection = async (req, res) => {
  try {
    const section = await Section.findById(req.params.id).populate('questions');
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};