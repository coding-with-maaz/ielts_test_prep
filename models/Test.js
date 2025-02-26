const mongoose = require('mongoose');
const { Schema } = mongoose;

const testSchema = new Schema({
  testName: {
    type: String,
    required: true,
  },
  sections: [{
    type: Schema.Types.ObjectId,
    ref: 'Section',
  }],
  audioUrls: {
    type: Map,
    of: String,
    required: true,
    default: new Map()
  }
});

const Test = mongoose.model('Test', testSchema);

module.exports = Test;