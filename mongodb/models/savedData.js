import mongoose from 'mongoose';

const SavedData = new mongoose.Schema(
    {
        username: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        questions: { type: [String], default: [] },
        summaries: { type: [String], default: [] },
        quizzes: [
            {
                question: { type: String, required: true },
                answer: { type: String, required: true },
                distractors: { type: [String], required: true }
            }
        ],
        flashcards: [
            {
                word: { type: String, required: true },
                meaning: { type: String, required: true }
            }
        ],
        audios: { type: [String], default: [] }
    },
    {
        collection: 'SavedData',
    }
);

const SavedDataSchema = mongoose.model('SavedData', SavedData);
export default SavedDataSchema;
