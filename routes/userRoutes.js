const express = require('express');
const router = express.Router();
const { addUser, verifyUser, loginUser, verifyLogin } = require('../controllers/userController');

// Send OTP for registration
router.post('/sendOTP', addUser);

// Verify OTP for registration
router.post('/verifyOTP', verifyUser);

// Send OTP for login
router.post('/sendOTPLogin', loginUser);

// Verify OTP for login
router.post('/verifyLogin', verifyLogin);



module.exports = router;
