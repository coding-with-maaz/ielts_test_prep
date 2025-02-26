const ReadingSection = require('../models/ReadingSection');
const ReadingQuestion = require('../models/ReadingQuestion');

exports.createReadingSection = async (req, res) => {
  try {
    const section = new ReadingSection(req.body);
    await section.save();
    res.status(201).json(section);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateReadingSection = async (req, res) => {
  try {
    const section = await ReadingSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Reading section not found' });
    }

    // Update section fields
    Object.keys(req.body).forEach(key => {
      section[key] = req.body[key];
    });

    await section.save();
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllReadingSections = async (req, res) => {
  try {
    const sections = await ReadingSection.find().populate('questions');
    res.json(sections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getReadingSection = async (req, res) => {
  try {
    const section = await ReadingSection.findById(req.params.id).populate('questions');
    if (!section) {
      return res.status(404).json({ message: 'Reading section not found' });
    }
    res.json(section);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReadingSection = async (req, res) => {
  try {
    const section = await ReadingSection.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Reading section not found' });
    }

    // Delete all associated questions
    for (const questionId of section.questions) {
      const question = await ReadingQuestion.findById(questionId);
      if (question) {
        // Delete diagram if exists
        if (question.diagramUrl) {
          const filePath = path.join(__dirname, '..', question.diagramUrl);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        await ReadingQuestion.findByIdAndDelete(questionId);
      }
    }

    await ReadingSection.findByIdAndDelete(req.params.id);
    res.json({ message: 'Reading section and associated questions deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};