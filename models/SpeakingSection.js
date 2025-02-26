const mongoose = require('mongoose');
const { Schema } = mongoose;

const speakingSectionSchema = new Schema({
  sectionName: {
    type: String,
    required: true, // Name of the section (e.g., "Part 1", "Part 2", "Part 3")
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'SpeakingQuestion', // Reference to the SpeakingQuestion model
  }]
});

const SpeakingSection = mongoose.model('SpeakingSection', speakingSectionSchema);

module.exports = SpeakingSection;
