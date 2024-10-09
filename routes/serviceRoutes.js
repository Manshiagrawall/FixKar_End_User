// routes/userServiceRoutes.js
const express = require('express');
const router = express.Router();
const userServiceController = require('../controllers/serviceController');

// Route to get all services for users
router.get('/getAllServices', userServiceController.getAllServices);

// Route to get a specific service by ID
router.get('/getService/:id', userServiceController.getServiceById);

router.get('/getServicesByCategory/:category', userServiceController.getServicesByCategory);

module.exports = router;
