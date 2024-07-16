import express from 'express'
import * as dotenv from 'dotenv'
// import {v2 as cloudinary} from 'cloudinary'
import Image from '../mongodb/models/savedData.js';
import fetch from "node-fetch";

dotenv.config();
const router = express.Router();


  router.route('/').post(async(req,res) => {
    try {

        const {prompt,username,email} = req.body
        const response = await fetch(`https://api.stability.ai/v1/generation/stable-diffusion-512-v2-1/text-to-image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              "Access-Control-Allow-Origin": "*",
              Authorization: `Bearer sk-GUEZtbJPmF5GSrBvF2J9i8tPFEySTvnPf5lQXtWWcMtUFXHE`,
            },
            body: JSON.stringify({
              text_prompts: [
                {
                  text: prompt,
                },
              ],
              cfg_scale: 6,
              height: 512,
              width: 512,
              steps: 23,
              samples: 1,
            }),
          })
          const responseJSON = await response.json()
          const base64Data = responseJSON.artifacts[0].base64;
          res.status(200).json({ photo: base64Data });
    } catch (error) {
        console.log("error ")
        console.log(error)
        res.status(500).send(error);
    }
  })

  
  router.route('/upload').post(async(req,res) => {
   const {photo,username,userId} = req.body
    // console.log(req.body);
   try {
    await Image.create({
      photo: photo,
      username,
      userId
    });
    res.status(200).json({ success: true});
   } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: 'Unable to upload the image, please try again' });
   }
  
      
  })
  export default router