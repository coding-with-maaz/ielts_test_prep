const Test = require('../models/Test');
const { calculateBandScore } = require('../utils/bandScoreCalculator');
const fs = require('fs');
const path = require('path');

exports.createTest = async (req, res) => {
  try {
    const audioUrls = {};
    
    // Handle uploaded files
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        const file = req.files[key][0];
        audioUrls[key] = `/uploads/audio/${file.filename}`;
      });
    }

    const test = new Test({
      ...req.body,
      audioUrls: new Map(Object.entries(audioUrls))
    });
    
    await test.save();
    res.status(201).json(test);
  } catch (error) {
    // Clean up uploaded files if test creation fails
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
    }
    res.status(400).json({ message: error.message });
  }
};

exports.updateTestAudio = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    const audioUrls = new Map(test.audioUrls);
    
    // Handle uploaded files
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        const file = req.files[key][0];
        // Delete old audio file if it exists
        const oldPath = audioUrls.get(key);
        if (oldPath) {
          const fullPath = path.join(__dirname, '..', oldPath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        }
        audioUrls.set(key, `/uploads/audio/${file.filename}`);
      });
    }

    test.audioUrls = audioUrls;
    await test.save();
    res.json(test);
  } catch (error) {
    // Clean up uploaded files if update fails
    if (req.files) {
      Object.values(req.files).forEach(fileArray => {
        fileArray.forEach(file => {
          fs.unlinkSync(file.path);
        });
      });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTests = async (req, res) => {
  try {
    const tests = await Test.find().populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate({
      path: 'sections',
      populate: { path: 'questions' }
    });
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.submitTest = async (req, res) => {
  try {
    const { answers } = req.body;
    const test = await Test.findById(req.params.id).populate({
      path: 'sections',
      populate: { path: 'questions' }
    });

    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    let totalScore = 0;
    let totalQuestions = 0;
    let attemptedQuestions = 0;
    const sectionScores = [];
    const questionResults = [];

    // Calculate scores for each section
    test.sections.forEach((section, index) => {
      let sectionScore = 0;
      let sectionAttempted = 0;
      const sectionQuestions = section.questions.length;
      const sectionResults = [];
      
      section.questions.forEach(question => {
        const userAnswer = answers[question._id];
        const isAttempted = userAnswer !== undefined && userAnswer !== null && userAnswer.trim() !== '';
        const isCorrect = isAttempted && userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
        
        // Status can be 'correct', 'incorrect', or 'unattempted'
        const status = isAttempted ? (isCorrect ? 'correct' : 'incorrect') : 'unattempted';
        
        if (isCorrect) {
          sectionScore++;
          totalScore++;
        }
        
        if (isAttempted) {
          sectionAttempted++;
          attemptedQuestions++;
        }
        
        sectionResults.push({
          questionId: question._id,
          questionText: question.questionText,
          userAnswer: userAnswer || '',
          correctAnswer: question.correctAnswer,
          isCorrect: isCorrect,
          isAttempted: isAttempted,
          status: status,
          answerType: question.answerType
        });
      });
      
      totalQuestions += sectionQuestions;
      sectionScores.push({
        sectionId: section._id,
        sectionName: section.sectionName,
        score: sectionScore,
        total: sectionQuestions,
        attempted: sectionAttempted,
        unattempted: sectionQuestions - sectionAttempted,
        percentage: (sectionScore / sectionQuestions) * 100,
        questions: sectionResults
      });
      
      questionResults.push(...sectionResults);
    });

    // Calculate overall band score based on correct answers
    const bandScore = calculateBandScore(totalScore, totalQuestions);

    // Calculate completion rate
    const completionRate = (attemptedQuestions / totalQuestions) * 100;

    // Determine performance level based on band score
    let performanceLevel = '';
    if (bandScore >= 8.0) performanceLevel = 'Expert';
    else if (bandScore >= 7.0) performanceLevel = 'Very Good';
    else if (bandScore >= 6.0) performanceLevel = 'Competent';
    else if (bandScore >= 5.0) performanceLevel = 'Modest';
    else performanceLevel = 'Limited';

    // Provide feedback based on unattempted questions
    let feedback = '';
    if (attemptedQuestions === totalQuestions) {
      feedback = 'You attempted all questions. Great job!';
    } else if (completionRate >= 90) {
      feedback = 'You attempted most questions. Try to answer all questions next time.';
    } else if (completionRate >= 75) {
      feedback = 'You missed several questions. Remember that unattempted questions count against your score.';
    } else if (completionRate >= 50) {
      feedback = 'You missed many questions. Time management might be an issue to work on.';
    } else {
      feedback = 'You missed most questions. Focus on improving your time management and attempting all questions.';
    }

    res.json({
      overallScore: {
        correct: totalScore,
        total: totalQuestions,
        attempted: attemptedQuestions,
        unattempted: totalQuestions - attemptedQuestions,
        percentage: (totalScore / totalQuestions) * 100,
        completionRate: completionRate,
        bandScore: bandScore,
        performanceLevel: performanceLevel
      },
      sectionScores: sectionScores,
      questionResults: questionResults,
      details: {
        totalQuestions,
        attemptedQuestions,
        unattemptedQuestions: totalQuestions - attemptedQuestions,
        correctAnswers: totalScore,
        incorrectAnswers: attemptedQuestions - totalScore
      },
      feedback: feedback,
      improvementAreas: getImprovementAreas(sectionScores)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to identify areas for improvement
function getImprovementAreas(sectionScores) {
  const weakestSections = sectionScores
    .map(section => ({
      sectionName: section.sectionName,
      percentage: section.percentage,
      unattemptedRate: (section.unattempted / section.total) * 100
    }))
    .sort((a, b) => a.percentage - b.percentage)
    .slice(0, 2);

  const improvementAreas = [];

  weakestSections.forEach(section => {
    let advice = `Focus on improving your performance in ${section.sectionName}.`;
    
    if (section.unattemptedRate > 25) {
      advice += ` You left ${section.unattemptedRate.toFixed(0)}% of questions unattempted in this section. Work on time management.`;
    } else if (section.percentage < 50) {
      advice += ` Your accuracy in this section was low. Practice more with similar question types.`;
    }
    
    improvementAreas.push(advice);
  });

  // Add general advice
  if (improvementAreas.length === 0) {
    improvementAreas.push("Your performance was balanced across all sections. Continue practicing to maintain consistency.");
  }

  return improvementAreas;
}