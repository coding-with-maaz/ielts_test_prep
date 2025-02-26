const WritingTest = require('../models/WritingTest');
const fs = require('fs');
const path = require('path');

exports.createWritingTest = async (req, res) => {
  try {
    const audioUrls = {};

    // Handle uploaded files (audio for sections)
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        const file = req.files[key][0];
        audioUrls[key] = `/uploads/audio/${file.filename}`;
      });
    }

    const writingTest = new WritingTest({
      ...req.body,
      audioUrls: new Map(Object.entries(audioUrls)),
    });

    await writingTest.save();
    res.status(201).json(writingTest);
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

exports.updateWritingTestAudio = async (req, res) => {
  try {
    const writingTest = await WritingTest.findById(req.params.id);
    if (!writingTest) {
      return res.status(404).json({ message: 'Writing Test not found' });
    }

    const audioUrls = new Map(writingTest.audioUrls);

    // Handle uploaded audio files
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        const file = req.files[key][0];

        // Delete old audio file if it exists
        const oldPath = audioUrls.get(key);
        if (oldPath) {
          const fullPath = path.join(__dirname, '..', oldPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
        audioUrls.set(key, `/uploads/audio/${file.filename}`);
      });
    }

    writingTest.audioUrls = audioUrls;
    await writingTest.save();
    res.json(writingTest);
  } catch (error) {
    // Clean up uploaded files if update fails
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getAllWritingTests = async (req, res) => {
  try {
    const writingTests = await WritingTest.find().populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    res.json(writingTests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWritingTest = async (req, res) => {
  try {
    const writingTest = await WritingTest.findById(req.params.id).populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    if (!writingTest) {
      return res.status(404).json({ message: 'Writing Test not found' });
    }
    res.json(writingTest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitWritingTest = async (req, res) => {
  try {
    // Logic for submitting the test (e.g., calculating scores)
    res.json({ message: 'Test submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
