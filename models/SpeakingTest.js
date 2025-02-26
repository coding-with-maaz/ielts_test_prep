const mongoose = require('mongoose');
const { Schema } = mongoose;

const speakingTestSchema = new Schema({
  testName: {
    type: String,
    required: true, // Name of the speaking test (e.g., "IELTS Speaking Test 1")
  },
  sections: [{
    type: Schema.Types.ObjectId,
    ref: 'SpeakingSection', // Reference to the SpeakingSection model
  }],
  audioUrls: {
    type: Map,
    of: String, // Store the URLs of audio files for each section
    required: true,
    default: new Map(),
  },
  timeLimit: {
    type: Number,
    default: 15, // 15 minutes for speaking test
  }
});

const SpeakingTest = mongoose.model('SpeakingTest', speakingTestSchema);

module.exports = SpeakingTest;
