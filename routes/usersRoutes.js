// routes/userRoutes.js
import fetch from "node-fetch";

import express from 'express';
const router = express.Router();
import bcrypt from 'bcrypt'
import  jwt from 'jsonwebtoken'
import userImageDetails from '../mongodb/models/imageDetails.js'
import userDetails from '../mongodb/models/userDetails.js'
import token from '../mongodb/models/token.js'
import  nodemailer from 'nodemailer';
import crypto  from 'crypto';

const User = userDetails
const Images = userImageDetails
const Token = token

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";

router.route('/').get(async (req, res) => {
 
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});


// userType

router.route('/register').post(async (req, res) => {
  const { username, email, password} = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.json({ error: "User Exists" });
    }

 
    const token = crypto.randomBytes(20).toString('hex');
    const newToken = new Token({ email, token });
    await newToken.save();
    
    // // Configure Nodemailer for sending emails
    // const transporter = nodemailer.createTransport({
    //   service: 'Gmail', // Replace with your email service (e.g., 'Gmail')
    //   auth: {
    //     user: 'LearningRealm@gmail.com', // Replace with your email address
    //     pass: 'fibl qsix wcvy vmbo', // Replace with your email password
    //   },
    // });

    // // Send a verification email
    // const verificationLink = `https://build-seven-self.vercel.app/verification?token=${token}`;
    // const mailOptions = {
    //   from: 'LearningRealm@gmail.com',
    //   to: email,
    //   subject: 'Account Verification',
    //   html: `
    //   <!DOCTYPE html>
    //   <html lang="en">
    //   <head>
    //       <meta charset="UTF-8">
    //       <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //       <title>Account Verification</title>
    //       <style>
    //           /* Reset some default styles */
    //           body {
    //               margin: 0;
    //               padding: 0;
    //               background-color: #f4f4f4;
    //               font-family: Arial, sans-serif;
    //           }
      
    //           /* Container */
    //           .container {
    //               max-width: 600px;
    //               margin: 0 auto;
    //               background-color: #ffffff;
    //               border-radius: 5px;
    //               box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    //           }
      
    //           /* Header */
    //           .header {
    //               background-color: #007bff;
    //               color: #fff;
    //               text-align: center;
    //               padding: 20px 0;
    //               font-size: 24px;
    //           }
      
    //           /* Content */
    //           .content {
    //               padding: 20px;
    //           }
      
    //           h1 {
    //               color: #333;
    //               font-size: 24px;
    //               margin: 0;
    //           }
      
    //           p {
    //               font-size: 16px;
    //               margin: 0 0 20px;
    //           }
      
    //           .verification-link {
    //               background-color: #007bff;
    //               color: #fff;
    //               text-decoration: none;
    //               padding: 10px 20px;
    //               border-radius: 5px;
    //               display: inline-block;
    //           }
      
    //           /* Footer */
    //           .footer {
    //               text-align: center;
    //               padding: 20px 0;
    //               background-color: #f4f4f4;
    //           }
    //       </style>
    //   </head>
    //   <body>
    //       <div class="container">
    //           <div class="header">
    //               <h1>Learning Realm </h1>
    //           </div>
    //           <div class="content">
    //               <h1>Account Verification</h1>
    //               <p>Dear User,</p>
    //               <p>Click the button below to verify your account:</p>
    //               <a class="verification-link" href="${verificationLink}">Verify Account</a>
    //           </div>
    //           <div class="footer">
    //               <p>&copy; ${new Date().getFullYear()} Learning Realm. All rights reserved.</p>
    //           </div>
    //       </div>
    //   </body>
    //   </html>      
    //   `,
    // };
  
    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     console.error('Error sending verification email:', error);
    //     // res.status(500).json({ status: "error", message: 'Failed to send verification email' });
    //   } else {
    //     console.log('Verification email sent:', info.response);
    //     // Continue with the registration process or send a response indicating success
    //     // You can also choose to send the verification email before creating the user
    //     // to ensure that the user is only created if the email is sent successfully.
    //     // ...
    //   }
    // });

    // Create the user (you may want to move this to after email is sent successfully)
    await User.create({
      username,
      email,
      password: encryptedPassword,
    });

    // userType,
    // isVerified: false, // Add a flag to track user verification status
    // Check your email for verification instructions.' 
    res.json({ status: "ok", message: 'Registration successful. '});
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: 'Failed to register user' });
  }
});

router.route('/verify/:token').get(async (req, res) => {
  const { token } = req.params;
  // Check if the email associated with the token exists in your tokensDB map
  // const newToken = new Token({ email, token });
  const allData = await Token.find({ });
  console.log(allData);
  const tokenRecord = await Token.findOne({ token:token });
  console.log("tokenRecord : ");
  console.log(tokenRecord);
  if (tokenRecord) {
    console.log('Trial ');
    const userEmail = tokenRecord.email;

    // Update user's isVerified property
    await User.findOneAndUpdate(
      { email: userEmail },
      { $set: { isVerified: true } }
    );
    // Delete the token record from MongoDB
    await tokenRecord.remove();
    // Verification successful
    res.status(200).json({ message: 'Verification successful. You can now log in.' });
  } else {
    // Token not found or expired
    res.status(400).json({ error: 'Invalid or expired verification token, please try again.' });
  }
});


router.route('/resend-verification').post(async (req,res) => {

  const {email } = req.body 
  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser) {
      return res.json({ error: "User doesn't Exist" });
    }
  }catch(error){
  console.log("error");
  console.log(error);
  }
  try {
    
    const token = crypto.randomBytes(20).toString('hex');
    const newToken = new Token({ email, token });
    await newToken.save();
    // Configure Nodemailer for sending emails
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Replace with your email service (e.g., 'Gmail')
      auth: {
        user: 'LearningRealm@gmail.com', // Replace with your email address
        pass: 'fibl qsix wcvy vmbo', // Replace with your email password
      },
    });

    // Send a verification email
    const verificationLink = `https://build-seven-self.vercel.app/verification?token=${token}`;
    const mailOptions = {
      from: 'LearningRealm@gmail.com',
      to: email,
      subject: 'Account Verification',
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verification</title>
          <style>
              /* Reset some default styles */
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  font-family: Arial, sans-serif;
              }
      
              /* Container */
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  border-radius: 5px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
      
              /* Header */
              .header {
                  background-color: #007bff;
                  color: #fff;
                  text-align: center;
                  padding: 20px 0;
                  font-size: 24px;
              }
      
              /* Content */
              .content {
                  padding: 20px;
              }
      
              h1 {
                  color: #333;
                  font-size: 24px;
                  margin: 0;
              }
      
              p {
                  font-size: 16px;
                  margin: 0 0 20px;
              }
      
              .verification-link {
                  background-color: #007bff;
                  color: #fff;
                  text-decoration: none;
                  padding: 10px 20px;
                  border-radius: 5px;
                  display: inline-block;
              }
      
              /* Footer */
              .footer {
                  text-align: center;
                  padding: 20px 0;
                  background-color: #f4f4f4;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>Learning Realm</h1>
              </div>
              <div class="content">
                  <h1>Account Verification</h1>
                  <p>Dear User,</p>
                  <p>Click the button below to verify your account:</p>
                  <a class="verification-link" href="${verificationLink}">Verify Account</a>
              </div>
              <div class="footer">
                  <p>&copy; ${new Date().getFullYear()} Learning Realm. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>      
      `,
    };
    
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending verification email:', error);
        // res.status(500).json({ status: "error", message: 'Failed to send verification email' });
      } else {
        console.log('Verification email sent:', info.response);
        // Continue with the registration process or send a response indicating success
        // You can also choose to send the verification email before creating the user
        // to ensure that the user is only created if the email is sent successfully.
        // ...
      }
    });
    return res.json({status:"ok",message:"Verification Link Sent Successfully"})
  } catch (error) {
    return res.json({error:"An Error Occured , Please Try Again"})

  }
})

router.route('/update-user-profile-image').post(async (req, res) => {
  // console.log("req body  : ");
  // console.log(req.body);
  const { base64,userId } = req.body;

  try {
    const user = await User.findOne({ _id:userId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.defaultIcon = base64;
    await user.save();
    return res.json({ status: 'ok' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});


router.route('/login').post(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    // expiration time for the token
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "5d",
    });

    if (res.status(201)) {
        if(user.isVerified){
          return res.json({ status: "ok", data: token });
        }else{
          return res.json({ error: "Email Not Verified" });
        }
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

// Route to get user data
router.route('/userData').post(async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    // console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        // console.log("data : ");
        // console.log(data);
        jwt.sign({ email: data.email }, JWT_SECRET, {
          expiresIn: "6d", // Token expires in 15 minutes
        });
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

router.route('/specificUserData').get(async (req, res) => {
  
  const { userId } = req.query;
 
  try {
    
    await User.findOne({ _id : userId })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {
    console.log(error);
  }
});
router.route('/ImageUserData').post(async (req, res) => {
  const { userId } = req.body;
  try {
    const data = await User.findOne({_id:userId}).lean();
    // const data = await User.findOne({ _id: userId }).lean();
    // console.log(data); // You can directly access the user data here
    const {username,defaultIcon} = data
    res.json({ success: true, data: {username,defaultIcon} });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error In Fetching Images User Data, please try again' });

  }
});

router.route('/forgot-password').post(async (req, res) => {
    const { email } = req.body;
    try {
      const oldUser = await User.findOne({ email });
      if (!oldUser) {
        return res.json({ status: "User Not Exists!!" });
      }
      const secret = JWT_SECRET + oldUser.password;
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
        expiresIn: "6d",
      });
      const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "adarsh438tcsckandivali@gmail.com",
          pass: "rmdklolcsmswvyfw",
        },
      });
  
      var mailOptions = {
        from: "youremail@gmail.com",
        to: "thedebugarena@gmail.com",
        subject: "Password Reset",
        text: link,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          // console.log("Email sent: " + info.response);
        }
      });
      // console.log(link);
    } catch (error) { }
  });
  
  router.route('/reset-password/:id/:token').get(async (req, res) => {
    const { id, token } = req.params;
    // console.log(req.params);
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      res.render("index", { email: verify.email, status: "Not Verified" });
    } catch (error) {
      console.log(error);
      res.send("Not Verified");
    }
  });
  
  
router.route('/reset-password/:id/:token').post( async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    try {
      const verify = jwt.verify(token, secret);
      const encryptedPassword = await bcrypt.hash(password, 10);
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.render("index", { email: verify.email, status: "verified" });
    } catch (error) {
      console.log(error);
      res.json({ status: "Something Went Wrong" });
    }
  });
  
  router.route('/getAllUser').get(async (req, res) => {
    try {
      const allUser = await User.find({});
      res.send({ status: "ok", data: allUser });
    } catch (error) {
      console.log(error);
    }
  });
  
  router.route('/deleteUser').post(async (req, res) => {
    const { userid } = req.body;
    try {
      User.deleteOne({ _id: userid }, function (err, res) {
        console.log(err);
      });
      res.send({ status: "Ok", data: "Deleted" });
    } catch (error) {
      console.log(error);
    }
  });
  
  
  router.route('/upload-user-image').post(async (req, res) => {
    const { base64 } = req.body;
    try {
      await Images.create({ image: base64 });
      res.send({ Status: "ok" })
  
    } catch (error) {
      res.send({ Status: "error", data: error });
  
    }
  })
  
  router.route('/get-image').get(async (req, res) => {
    try {
      await Images.find({}).then(data => {
        res.send({ status: "ok", data: data })
      })
  
    } catch (error) {
  
    }
  })
  

export default router;