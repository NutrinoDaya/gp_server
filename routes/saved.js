import express from 'express';
import * as dotenv from 'dotenv';
import SavedData from '../mongodb/models/savedData.js'
import userDetails from '../mongodb/models/userDetails.js'
dotenv.config();

const router = express.Router();

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

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

// Route to retrieve summaries
router.route('/summaries').get(async (req, res) => {
  try {
      const { username } = req;
      const data = await SavedData.findOne({ username }, 'summaries');
      if (data) {
          res.status(200).json({ success: true, summaries: data.summaries });
      } else {
          res.status(404).json({ success: false, message: 'No data found for the given username' });
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Fetching summaries failed, please try again' });
  }
});

// Route to retrieve quizzes
router.route('/quizzes').get(async (req, res) => {
  try {
      const { username } = req;
      const data = await SavedData.findOne({ username }, 'quizzes');
      if (data) {
          res.status(200).json({ success: true, quizzes: data.quizzes });
      } else {
          res.status(404).json({ success: false, message: 'No data found for the given username' });
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Fetching quizzes failed, please try again' });
  }
});

// Route to retrieve flashcards
router.route('/flashcards').get(async (req, res) => {
  try {
      const { username } = req;
      const data = await SavedData.findOne({ username }, 'flashcards');
      if (data) {
          res.status(200).json({ success: true, flashcards: data.flashcards });
      } else {
          res.status(404).json({ success: false, message: 'No data found for the given username' });
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Fetching flashcards failed, please try again' });
  }
});

// Route to retrieve audios
router.route('/audios').get(async (req, res) => {
  try {
      const { username } = req;
      const data = await SavedData.findOne({ username }, 'audios');
      if (data) {
          res.status(200).json({ success: true, audios: data.audios });
      } else {
          res.status(404).json({ success: false, message: 'No data found for the given username' });
      }
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Fetching audios failed, please try again' });
  }
});


// Route to store summaries
router.route('/summaries').post(async (req, res) => {
    try {
        // Extract token and summaries from request body
        const { token, summaries } = req.body;
        console.log('Request body:', req.body);

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        // Verify and decode the token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
            console.log('Decoded token:', decoded);
        } catch (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ success: false, message: 'Invalid or expired token' });
        }

        // Retrieve the user using the email from the decoded token
        const user = await userDetails.findOne({ email: decoded.email });
        if (!user) {
            console.log('User not found for email:', decoded.email);
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        console.log('User found:', user);

        // Retrieve the userId
        const userId = user._id;
        console.log('UserId:', userId);

        // Update or create the SavedData record
        const data = await SavedData.findOneAndUpdate(
            { userId },
            { $set: { summaries } },
            { new: true, upsert: true }
        );
        console.log('Updated or created SavedData record:', data);

        // Send success response
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error('Error storing summaries:', err);
        res.status(500).json({ success: false, message: 'Storing summaries failed, please try again' });
    }
});

// Route to store quizzes
router.route('/quizzes').post(async (req, res) => {
  try {
      const { username } = req;
      const { quizzes } = req.body;
      const data = await SavedData.findOneAndUpdate(
          { username },
          { $set: { quizzes } },
          { new: true, upsert: true }
      );
      res.status(200).json({ success: true, data });
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Storing quizzes failed, please try again' });
  }
});

// Route to store flashcards
router.route('/flashcards').post(async (req, res) => {
  try {
      const { username } = req;
      const { flashcards } = req.body;
      const data = await SavedData.findOneAndUpdate(
          { username },
          { $set: { flashcards } },
          { new: true, upsert: true }
      );
      res.status(200).json({ success: true, data });
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Storing flashcards failed, please try again' });
  }
});

// Route to store audios
router.route('/audios').post(async (req, res) => {
  try {
      const { username } = req;
      const { audios } = req.body;
      const data = await SavedData.findOneAndUpdate(
          { username },
          { $set: { audios } },
          { new: true, upsert: true }
      );
      res.status(200).json({ success: true, data });
  } catch (err) {
      console.log(err);
      res.status(500).json({ success: false, message: 'Storing audios failed, please try again' });
  }
});

export default router;
