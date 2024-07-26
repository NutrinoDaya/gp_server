import mongoose from 'mongoose';

const SavedData = new mongoose.Schema(
  {
    username: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    questions: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
        shared: { type: Boolean, default: false }
      }
    ],
    summaries: [
      {
        text: { type: String, required: true },
        shared: { type: Boolean, default: false } // shared is now optional with a default value
      }
    ],
    quizzes: [
    [
        {
          question: { type: String, required: true },
          answer: { type: String, required: true },
          distractors: { type: [String], required: true },
          shared: { type: Boolean, default: false }
        }
    ]
    ],
    flashcards: [
      {
        word: { type: String, required: true },
        meaning: { type: String, required: true },
        shared: { type: Boolean, default: false }
      }
    ],
    audios: [
      {
        url: { type: String, required: true },
        shared: { type: Boolean, default: false }
      }
    ]
  },
  {
    collection: 'SavedData',
  }
);

const SavedDataSchema = mongoose.model('SavedData', SavedData);
export default SavedDataSchema;
