const mongoose = require('mongoose');
const { Schema } = mongoose;

const writingQuestionSchema = new Schema({
  questionText: {
    type: String,
    required: true,
  },
  answerType: {
    type: String,
    required: true,
    enum: ['short-answer', 'multiple-choice', 'essay', 'diagram-completion', 'table-completion']
  },
  options: {
    type: [String],
    default: undefined
  },
  correctAnswer: {
    type: String,
    required: true, // Make sure this is required
  },
  instructions: {
    type: String
  },
  diagramUrl: {
    type: String
  }
});

const WritingQuestion = mongoose.model('WritingQuestion', writingQuestionSchema);

module.exports = WritingQuestion;
