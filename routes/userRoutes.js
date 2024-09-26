const express = require('express');
const router = express.Router();
const { addUser, verifyUser, loginUser, verifyLogin } = require('../controllers/userController');
const userProfile = require('../controllers/userProfile');

// Send OTP for registration
router.post('/sendOTP', addUser);

// Verify OTP for registration
router.post('/verifyOTP', verifyUser);

// Send OTP for login
router.post('/sendOTPLogin', loginUser);

// Verify OTP for login
router.post('/verifyLogin', verifyLogin);

// Route to get user details
router.get('/getUser', userProfile.getUser);

// Route to update user details
router.put('/updateUser', userProfile.updateUser);

// Route to delete user account
router.delete('/deleteUser', userProfile.deleteUser);

module.exports = router;
