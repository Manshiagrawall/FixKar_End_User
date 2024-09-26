const User = require("../models/User");
const { generateOTP, generateOTPExpiry } = require("../utils/generateOTP");
const OTP = require("../models/otpModel");
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const jwt = require('jsonwebtoken'); 
exports.addUser = async (req, res) => {
    const { phone } = req.body;
  try {
    const otpCode = generateOTP();
    const otpExpiry = generateOTPExpiry();

    const otp = new OTP({
      phone,
      otp: otpCode,
      otpExpiration: otpExpiry
    });
    await otp.save();

    await client.messages.create({
      body: `Your OTP code is ${otpCode}. Valid for 5 minutes.`,
      from: twilioPhoneNumber,
      to: phone
    });

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error in sendOTP:", err);
    res.status(500).json({ message: "Server error", err });
  }
  };
  

exports.loginUser = async (req, res) => {
    const { phone } = req.body;
    try {
      const existingPhone = await User.findOne({ phone });
      if (!existingPhone) {
        return res.status(400).json({ message: "This number is not registered" });
      }
  
      const otpCode = generateOTP();
      const otpExpiry = generateOTPExpiry();
  
      const otp = new OTP({
        phone,
        otp: otpCode,
        otpExpiration: otpExpiry
      });
      await otp.save();
  
      await client.messages.create({
        body: `Hello, your OTP code is ${otpCode}. Valid for 5 minutes.`,
        from: twilioPhoneNumber,
        to: phone
      });
  
      res.status(200).json({ user: { phone }, message: "OTP sent successfully" });
    } catch (err) {
      res.status(500).json({ message: "Server error", err });
    }
  };
  


  exports.verifyUser = async (req, res) => {
    const { name, phone, code } = req.body;
  
    if (!code) {
      return res.status(400).json({ message: "OTP code is required" });
    }
  
    try {
      const otpEntry = await OTP.findOne({ phone }).sort({ otpExpiration: -1 });
  
      if (!otpEntry || otpEntry.otp !== code) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
  
      await OTP.deleteOne({ _id: otpEntry._id });
  
      // Register the user only after OTP verification
      let user = new User({
        name,
        phone
      });
      await user.save();
  
      const payload = { user: { id: user._id, phone: user.phone } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ message: "OTP verified successfully, user registered", token });
    } catch (err) {
      console.error("Error verifying OTP:", err);
      res.status(500).json({ message: "Error verifying OTP" });
    }
  };
  exports.verifyLogin = async (req, res) => {
    const { phone, code } = req.body;
  
    if (!code) {
      return res.status(400).json({ message: "OTP code is required" });
    }
  
    try {
      const otpEntry = await OTP.findOne({ phone }).sort({ otpExpiration: -1 });
  
      if (!otpEntry || otpEntry.otp !== code) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
  
      await OTP.deleteOne({ _id: otpEntry._id });
  
      let user = await User.findOne({ phone });
      if (user) {
        const payload = { user: { id: user._id, phone: user.phone } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
        return res.status(200).json({ message: "OTP verified successfully", token });
      }
    } catch (err) {
      res.status(500).json({ message: "Error verifying OTP" });
    }
  };
  