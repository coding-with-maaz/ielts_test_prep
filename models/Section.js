const mongoose = require('mongoose');
const { Schema } = mongoose;

const sectionSchema = new Schema({
  sectionName: {
    type: String,
    required: true,
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
  }]
});

const Section = mongoose.model('Section', sectionSchema);

module.exports = Section;