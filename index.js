const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importing cors
const path = require('path');
require('dotenv').config();

const questionRoutes = require('./routes/questionRoutes');
const sectionRoutes = require('./routes/sectionRoutes');
const testRoutes = require('./routes/testRoutes');
const readingQuestionRoutes = require('./routes/readingQuestionRoutes');
const readingSectionRoutes = require('./routes/readingSectionRoutes');
const readingTestRoutes = require('./routes/readingTestRoutes');
const speakingQuestionRoutes = require('./routes/speakingQuestionRoutes');
const speakingSectionRoutes = require('./routes/speakingSectionRoutes');
const speakingTestRoutes = require('./routes/speakingTestRoutes');
const writingSectionRoutes = require('./routes/writingSectionRoutes');
const writingTestRoutes = require('./routes/writingTestRoutes');
const writingQuestionRoutes = require('./routes/writingQuestionRoutes');

const app = express();

// CORS Configuration
const corsOptions = {
  origin: '*', // Allow all origins, you can specify allowed origins instead of '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

// Middleware
app.use(cors(corsOptions)); // Apply CORS middleware with options
app.use(express.json());

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection with improved error handling and options
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if we can't connect to the database
});

// Routes
app.use('/api/questions', questionRoutes);
app.use('/api/sections', sectionRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/reading-questions', readingQuestionRoutes);
app.use('/api/reading-sections', readingSectionRoutes);
app.use('/api/reading-tests', readingTestRoutes);
app.use('/api/speaking-questions', speakingQuestionRoutes);
app.use('/api/speaking-sections', speakingSectionRoutes);
app.use('/api/speaking-tests', speakingTestRoutes);
app.use('/api/writing-questions', writingQuestionRoutes);
app.use('/api/writing-sections', writingSectionRoutes);
app.use('/api/writing-tests', writingTestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
