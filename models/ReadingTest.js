const mongoose = require('mongoose');
const { Schema } = mongoose;

const readingTestSchema = new Schema({
  testName: {
    type: String,
    required: true,
  },
  testType: {
    type: String,
    enum: ['academic', 'general'],
    required: true,
    default: 'academic'
  },
  sections: [{
    type: Schema.Types.ObjectId,
    ref: 'ReadingSection',
  }],
  timeLimit: {
    type: Number,
    default: 60 // 60 minutes
  }
});

const ReadingTest = mongoose.model('ReadingTest', readingTestSchema);

module.exports = ReadingTest;