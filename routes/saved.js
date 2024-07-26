import express from 'express';
import * as dotenv from 'dotenv';
import SavedData from '../mongodb/models/savedData.js';
import userDetails from '../mongodb/models/userDetails.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const router = express.Router();

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

// Helper function to verify token and get user
const verifyTokenAndGetUser = async (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userDetails.findOne({ email: decoded.email });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

// Route to retrieve all savedData
router.route('/').get(async (req, res) => {
  try {
    const data = await SavedData.find({});
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Fetching data failed, please try again' });
  }
});

// Route to retrieve all savedData for a specific user by token
router.route('/userData').post(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const data = await SavedData.findOne({ userId: user._id });

    if (data) {
      res.status(200).json({ success: true, data });
    } else {
      res.status(404).json({ success: false, message: 'No data found for the given user ID' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Fetching data failed, please try again' });
  }
});

// Helper function to format data
// Helper function to format data
const formatData = (data, term, defaultFields = {}) => {
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string') {
        return { [term]: item, ...defaultFields };
      }
      return { ...defaultFields, ...item };
    });
  }
  return data;
};

const flattenArray = (arr) => {
  return arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenArray(val)) : acc.concat(val), []);
};

const formatMCQData = (data) => {
  // Flatten the data if it is a nested array
  const flatData = flattenArray(data);
  
  return flatData.map(item => {
    if (typeof item === 'object' && item.question && item.correct_answer && Array.isArray(item.distractors)) {
      return {
        question: item.question,
        answer: item.correct_answer,
        distractors: item.distractors,
        shared: false // or true, depending on your requirements
      };
    }
    // Handle cases where item is not formatted as expected
    throw new Error('Invalid format for MCQ data');
  });
};


// Route to retrieve summaries
router.route('/get_summaries').post(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const data = await SavedData.findOne({ userId: user._id }, 'summaries');

    if (data) {
      res.status(200).json({ success: true, summaries: data.summaries });
    } else {
      res.status(404).json({ success: false, message: 'No data found for the given user ID' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Fetching summaries failed, please try again' });
  }
});

// Route to store summaries
router.route('/summaries').post(async (req, res) => {
  try {
    const { token, summaries } = req.body;
    console.log("summaries : " , summaries)
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const userId = user._id;

    const formattedSummaries = formatData(summaries, 'text',{ shared: false });

    const data = await SavedData.findOneAndUpdate(
      { userId },
      { $set: { summaries: formattedSummaries } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error storing summaries:', err);
    res.status(500).json({ success: false, message: 'Storing summaries failed, please try again' });
  }
});

// Route to retrieve quizzes
router.route('/get_quizzes').post(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const data = await SavedData.findOne({ userId: user._id }, 'quizzes');

    if (data) {
      res.status(200).json({ success: true, quizzes: data.quizzes });
    } else {
      res.status(404).json({ success: false, message: 'No data found for the given user ID' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Fetching quizzes failed, please try again' });
  }
});

// Route to store quizzes
router.route('/quizzes').post(async (req, res) => {
  try {
    const { token, quizzes } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const userId = user._id;
    const formattedQuizzes = formatMCQData(quizzes);

    const data = await SavedData.findOneAndUpdate(
      { userId },
      { $set: { quizzes: [formattedQuizzes] } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error storing quizzes:', err);
    res.status(500).json({ success: false, message: 'Storing quizzes failed, please try again' });
  }
});

// Route to retrieve flashcards
router.route('/get_flashcards').post(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const data = await SavedData.findOne({ userId: user._id }, 'flashcards');

    if (data) {
      res.status(200).json({ success: true, flashcards: data.flashcards });
    } else {
      res.status(404).json({ success: false, message: 'No data found for the given user ID' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Fetching flashcards failed, please try again' });
  }
});

// Route to store flashcards
router.route('/flashcards').post(async (req, res) => {
  try {
    const { token, flashcards } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const userId = user._id;

    const formattedFlashcards = formatData(flashcards,'word'); // Format flashcards if needed

    const data = await SavedData.findOneAndUpdate(
      { userId },
      { $set: { flashcards: formattedFlashcards } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error storing flashcards:', err);
    res.status(500).json({ success: false, message: 'Storing flashcards failed, please try again' });
  }
});

// Route to retrieve audios
router.route('/get_audios').post(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const data = await SavedData.findOne({ userId: user._id }, 'audios');

    if (data) {
      res.status(200).json({ success: true, audios: data.audios });
    } else {
      res.status(404).json({ success: false, message: 'No data found for the given user ID' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Fetching audios failed, please try again' });
  }
});

// Route to store audios
router.route('/audios').post(async (req, res) => {
  try {
    const { token, audios } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const userId = user._id;

    const formattedAudios = formatData(audios,'url'); // Format audios if needed

    const data = await SavedData.findOneAndUpdate(
      { userId },
      { $set: { audios: formattedAudios } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error storing audios:', err);
    res.status(500).json({ success: false, message: 'Storing audios failed, please try again' });
  }
});

// Route to retrieve questions
router.route('/get_questions').post(async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const data = await SavedData.findOne({ userId: user._id }, 'questions');

    if (data) {
      res.status(200).json({ success: true, questions: data.questions });
    } else {
      res.status(404).json({ success: false, message: 'No data found for the given user ID' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Fetching questions failed, please try again' });
  }
});

// Route to store questions
router.route('/questions').post(async (req, res) => {
  try {
    const { token, questions } = req.body;
    console.log("questions : " , questions)
    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided' });
    }

    const user = await verifyTokenAndGetUser(token);
    const userId = user._id;

    const formattedQuestions = formatData(questions,'questions'); // Format questions if needed
    console.log("formattedQuestions : " , formattedQuestions)

    const data = await SavedData.findOneAndUpdate(
      { userId },
      { $set: { questions: formattedQuestions } },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error('Error storing questions:', err);
    res.status(500).json({ success: false, message: 'Storing questions failed, please try again' });
  }
});

export default router;
