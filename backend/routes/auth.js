const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "It is what it is";
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");


// email config
const tarnsporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'easygoiiitdmj@gmail.com',
        pass: 'dyaguwbjpwlvdicl'
    }
})


//Route1: Create user using : POST "/api/auth/createuser" no login required
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 4 }),
    body("email").isLength({ min: 11 }),
    body("rollno").isLength({ min: 4 }),
    body("college").isLength({ min: 4 }),
    body("phonenumber").isLength({ min: 10 }),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    //if their are error , return bak reauests
    const errors = validationResult(req);
    let success=false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ success,errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success,error: "Sorry a user with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // check weather the user with email exists
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        rollno: req.body.rollno,
        college: req.body.college,
        phonenumber: req.body.phonenumber,
        password: secPass,
      })
     
        // .then((user) => res.json(user))
       
        const data = {
          user: {
            id: user.id,
          },
        };
       success=true
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ user,success,authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Inernal server error occured");
    }
  }
);

//Route2: Authenticate a user using post "api/auth/login" no login required
router.post(
  "/login",
  [
    body("email", "enter a valid email").isEmail(),
    body("password", "password  cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let success=false;
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({success, error: "please try to login with correct credential" });
      }
       
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({success, error: "please try with correct login credentials" });
      }
     success=true;
      const data = {
        user: {
          id: user.id,
        },
      };
      const id=user.id

      const authtoken = jwt.sign(data, JWT_SECRET);
      res.json({success, authtoken,id });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Inernal server error occured");
    }
  }
);

//Route3: getting user details using get "api/auth/getuser", login required
router.post('/getuser',fetchuser,async(req,res)=>{
  try {
    let userId=req.user.id;
    const user= await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send("Internal server error");
  }
  })


  // user send otp
  router.post(
    "/userotp",
    [
      body("email", "enter a valid email").isEmail(),
    ],async (req, res) => {
  const { email } = req.body;
  let success=false;

  if (!email) {
      res.status(400).json({ error: "Please Enter Your Email" })
  }


  try {
      
          const OTP = Math.floor(100000 + Math.random() * 900000);

          const existEmail = await userotp.findOne({ email: email });


          if (existEmail) {
              const updateData = await userotp.findByIdAndUpdate({ _id: existEmail._id }, {
                  otp: OTP
              }, { new: true }
              );
              await updateData.save();

              const mailOptions = {
                  from: 'easygoiiitdmj@gmail.com',
                  to: email,
                  subject: "Sending Eamil For Otp Validation",
                  text: `OTP:- ${OTP}`
              }


              tarnsporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      console.log("error", error);
                      res.status(400).json({ error: "email not send" })
                  } else {
                      console.log("Email sent", info.response);
                      success=true;
                      res.status(200).json({success:success, otp:OTP, message: "Email sent Successfully" })
                  }
              })

          } else {

              const saveOtpData = new userotp({
                  email, otp: OTP
              });

              await saveOtpData.save();
              const mailOptions = {
                  from: 'easygoiiitdmj@gmail.com',
                  to: email,
                  subject: "Sending Eamil For Otp Validation",
                  text: `OTP:- ${OTP}`
              }

              tarnsporter.sendMail(mailOptions, (error, info) => {
                  if (error) {
                      console.log("error", error);
                      res.status(400).json({ error: "email not send" })
                  } else {
                      console.log("Email sent", info.response);
                      success=true;
                      res.status(200).json({success:success, otp: OTP, message: "Email sent Successfully" })
                  }
              })
          }
      
  } catch (error) {
      res.status(400).json({ error: "Invalid Details", error })
  }
});


router.post(
  "/otpverf",
  [
    body("email", "enter a valid email").isEmail(),
    body("otp").isLength({ min: 6 })
  ],async(req,res)=>{
  const {email,otp} = req.body;
  const errors = validationResult(req);
 
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array() });
  }

  if(!otp || !email){
      res.status(400).json({ error: "Please Enter Your OTP and email" })
  }

  try {
      const otpverification = await userotp.findOne({email:email});
        let success=false;
      if(otpverification.otp === otp){
          const user = await User.findOne({email:email});
          
          // token generate
          // const token = await preuser.generateAuthtoken();
          const data = {
            user: {
              id: user.id,
            },
          };
          const id=user.id
    
          const authtoken = jwt.sign(data, JWT_SECRET);
          success=true;
          res.json({success,authtoken,id });
        //  res.status(200).json({message:"User Login Succesfully Done",userToken:token});

      }else{
          res.status(400).json({error:"Invalid Otp"})
      }
  } catch (error) {
      res.status(400).json({ error: "Invalid Details", error })
  }
});
router.post(
  "/fotpverf",
  [
    body("email", "enter a valid email").isEmail(),
    body("otp").isLength({ min: 6 })
  ],async(req,res)=>{
  const {email,otp} = req.body;
  const errors = validationResult(req);
 
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array() });
  }

  if(!otp || !email){
      res.status(400).json({ error: "Please Enter Your OTP and email" })
  }

  try {
      const otpverification = await userotp.findOne({email:email});
        let success=false;
      if(otpverification.otp === otp){
          
          success=true;
          res.json({success,otp});
        //  res.status(200).json({message:"User Login Succesfully Done",userToken:token});

      }else{
          res.status(400).json({error:"Invalid Otp"})
      }
  } catch (error) {
      res.status(400).json({ error: "Invalid Details", error })
  }
});
// Route 3: to update password
router.put("/updatepass",fetchuser, [
 // body("email", "enter a valid email").isEmail(),
  body("password").isLength({ min: 6 })
], async (req, res) => {
  const {  password } =
    req.body;
    
    const errors = validationResult(req);
   let success=false;
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array() });
  }
  const salt = await bcrypt.genSalt(10);
  const secPass = await bcrypt.hash(password, salt);

  try {
    const exist = await User.findOne({_id:req.user.id});
    if (exist) {
      const updateData = await User.findByIdAndUpdate({ _id: exist._id}, {
         password: secPass
      }, { new: true }
      );
      await updateData.save();}
      success=true;
      res.json({success})
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Inernal Server Error");
  }
});


module.exports = router;
