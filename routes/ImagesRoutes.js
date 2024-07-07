import express from 'express';
import * as dotenv from 'dotenv';
import Image from '../mongodb/models/image.js';

dotenv.config();

const router = express.Router();

router.route('/').get(async (req, res) => {
  try {
    await Image.find({}).then( data => {
      // console.log(data)
        res.status(200).json({ success: true, data: data });

    });
   
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Fetching posts failed, please try again' });
  }
});

router.route('/').post(async (req, res) => {
  try {
    const {base64,username,userId} = req.body;
    
    await Image.create({
      photo: base64,
      username,
      userId
    });
    res.status(200).json({ success: true});
  } catch (err) {
    console.log(err)
    res.status(500).json({ success: false, message: 'Unable to upload the image, please try again' });
  }
});
router.route('/myCreations').get(async (req, res) => {
  const { userId } = req.query;

  try {
    const data = await Image.find({ userId: userId }).lean();
   
    res.json({ success: true, data: data });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Fetching Images failed, please try again' });
  }
});

export default router;
