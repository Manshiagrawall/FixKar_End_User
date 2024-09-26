const Service = require('../models/Service');
const jwt = require('jsonwebtoken');

// Get all services for users
exports.getAllServices = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally, you can retrieve user information from the decoded token if needed

    const services = await Service.find();
    res.status(200).json({ services });
  } catch (err) {
    console.error('Error fetching services:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific service by ID
exports.getServiceById = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { id } = req.params; // Service ID

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Optionally, you can retrieve user information from the decoded token if needed

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (err) {
    console.error('Error fetching service:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
