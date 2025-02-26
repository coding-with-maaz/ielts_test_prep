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
    enum: [
      'multiple-choice',
      'short-answer',
      'sentence-completion',
      'notes-completion',
      'summary-completion',
      'plan-completion',
      'diagram-completion',
      'table-completion',
      'chart-completion',
      'diagram-labelling',
      'classification',
      'matching'
    ],
  },
  options: {
    type: [String],  // Options for multiple-choice questions
    default: undefined
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  instructions: {
    type: String, // Instructions related to the question
  },
  diagramUrl: {
    type: String, // URL for the diagram if uploaded
  }
});

const WritingQuestion = mongoose.model('WritingQuestion', writingQuestionSchema);

module.exports = WritingQuestion;
