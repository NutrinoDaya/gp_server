import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import AI from './routes/AI.js';
import ImagesRoutes from './routes/ImagesRoutes.js'
import usersRoutes from './routes/usersRoutes.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

app.use('/api/AI', AI);
app.use('/api/Images',ImagesRoutes)
app.use('/api/Users',usersRoutes)

app.get('/', async (req, res) => {
  res.status(200).json({
    message: 'Hello from BackEnd!',
  });
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    console.log(error);
  }
};

startServer();
