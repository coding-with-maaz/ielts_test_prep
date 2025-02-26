const mongoose = require('mongoose');
require('dotenv').config();
const SpeakingQuestion = require('../models/SpeakingQuestion');
const SpeakingSection = require('../models/SpeakingSection');
const SpeakingTest = require('../models/SpeakingTest');
const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const audioDir = 'uploads/audio';
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const sampleData = {
  questions: [
    // Section 1: Introduction
    {
      questionText: "What is your name?",
      answerType: "short-answer",  // Changed to a valid value
      correctAnswer: "John Doe", // Correct answer provided for short-answer questions
      instructions: "Answer the following question"
    },
    {
      questionText: "Where are you from?",
      answerType: "short-answer",  // Changed to a valid value
      correctAnswer: "New York", // Correct answer provided for short-answer questions
      instructions: "Answer the following question"
    },
    // Section 2: Topic Discussion
    {
      questionText: "Describe your favorite hobby.",
      answerType: "short-answer", // Changed to short-answer for consistency
      instructions: "Speak about your favorite hobby for 1-2 minutes",
      correctAnswer: "No specific answer" // Placeholder for open-ended questions
    },
    // Section 3: Discussion
    {
      questionText: "Do you think technology is helping or harming society?",
      answerType: "short-answer", // Changed to short-answer
      instructions: "Speak about your opinion for 2-3 minutes",
      correctAnswer: "No specific answer" // Placeholder for open-ended questions
    }
  ],
  sections: [
    {
      sectionName: "Section 1: Introduction",
      questions: [] // Will be populated after questions are created
    },
    {
      sectionName: "Section 2: Topic Discussion",
      questions: [] // Will be populated after questions are created
    },
    {
      sectionName: "Section 3: Discussion",
      questions: [] // Will be populated after questions are created
    }
  ],
  tests: [
    {
      testName: "IELTS Speaking Practice Test 1",
      sections: [], // Will be populated after sections are created
      audioUrls: {
        "section1": "https://example.com/audio/section1.mp3",
        "section2": "https://example.com/audio/section2.mp3",
        "section3": "https://example.com/audio/section3.mp3"
      }
    }
  ]
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await SpeakingQuestion.deleteMany({});
    await SpeakingSection.deleteMany({});
    await SpeakingTest.deleteMany({});
    console.log('Cleared existing speaking test data');

    // Create questions
    const createdQuestions = await SpeakingQuestion.insertMany(sampleData.questions);
    console.log('Created speaking questions');

    // Create sections with references to questions
    const sectionsWithQuestions = sampleData.sections.map((section, index) => ({
      ...section,
      questions: createdQuestions.slice(index * 1, (index * 1) + 1) // Adjust slicing based on questions per section
    }));
    const createdSections = await SpeakingSection.insertMany(sectionsWithQuestions);
    console.log('Created speaking sections');

    // Create test with references to sections
    const testWithSections = {
      ...sampleData.tests[0],
      sections: createdSections
    };
    const createdTest = await SpeakingTest.create(testWithSections);
    console.log('Created speaking test');

    console.log('Speaking test database seeded successfully!');
    console.log(`Created ${createdQuestions.length} speaking questions`);
    console.log(`Created ${createdSections.length} speaking sections`);
    console.log(`Created 1 speaking test with ${createdSections.length} sections`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding speaking test database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();
