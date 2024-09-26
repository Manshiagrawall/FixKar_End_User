const express = require('express');
const router = express.Router();
const { requestService, getRequests } = require('../controllers/requestController');

// Route to request a service
router.post('/request', requestService); // Ensure this matches your API endpoint
// Route to get all requests for the user
router.get('/requests', getRequests); // Ensure this matches your API endpoint

module.exports = router;
