const mongoose = require('mongoose');
const { Schema } = mongoose;

const writingTestSchema = new Schema({
  testName: {
    type: String,
    required: true, // Name of the writing test (e.g., "IELTS Academic Writing")
  },
  sections: [{
    type: Schema.Types.ObjectId,
    ref: 'WritingSection', // References to WritingSections
  }],
  audioUrls: {
    type: Map,
    of: String, // Map storing audio URLs for each section (section1, section2, etc.)
    required: true,
    default: new Map(),
  }
});

const WritingTest = mongoose.model('WritingTest', writingTestSchema);

module.exports = WritingTest;
