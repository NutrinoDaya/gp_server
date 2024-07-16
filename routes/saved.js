import express from 'express';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import SavedData from '../mongodb/models/savedData.js';
import User from '../mongodb/models/User.js'; // Make sure to import your User model

dotenv.config();

const router = express.Router();

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

// Route to retrieve summaries by username
router.route('/summaries/:username').get(async (req, res) => {
  try {
    const { username } = req.params;
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

// Route to retrieve quizzes by username
router.route('/quizzes/:username').get(async (req, res) => {
  try {
    const { username } = req.params;
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

// Route to retrieve flashcards by username
router.route('/flashcards/:username').get(async (req, res) => {
  try {
    const { username } = req.params;
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

// Route to retrieve audios by username
router.route('/audios/:username').get(async (req, res) => {
  try {
    const { username } = req.params;
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
router.route('/summaries/:username').post(async (req, res) => {
  try {
    const { username } = req.params;
    const { summaries } = req.body;
    const data = await SavedData.findOneAndUpdate(
      { username },
      { $set: { summaries } },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Storing summaries failed, please try again' });
  }
});

// Route to store quizzes
router.route('/quizzes/:username').post(async (req, res) => {
  try {
    const { username } = req.params;
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
router.route('/flashcards/:username').post(async (req, res) => {
  try {
    const { username } = req.params;
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
router.route('/audios/:username').post(async (req, res) => {
  try {
    const { username } = req.params;
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
