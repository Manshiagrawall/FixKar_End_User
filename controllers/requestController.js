const Booking = require('../models/RequestModel'); // Ensure this matches the correct model
const Service = require('../models/Service');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Request a service
exports.requestService = async (req, res) => {
    const { serviceId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify token to get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        // Check if the service exists
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }

        // Get the provider ID from the service
        const providerId = service.provider;

        // Check if there are any active requests (pending or accepted) for this service
        const existingRequest = await Booking.findOne({
            userId: userId,
            serviceId: serviceId,
            status: { $in: ['Pending', 'Accepted'] }
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You already have an active request for this service.' });
        }

        // Create a new request if no active request exists
        const request = new Booking({
            userId: userId,
            providerId: providerId,
            serviceId: serviceId,
            status: 'Pending'
        });

        await request.save();
        res.status(201).json({ message: 'Service requested successfully', request });
    } catch (err) {
        console.error('Error requesting service:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};


// Get all requests for the user
exports.getRequests = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify token and get user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        // Fetch all requests for the user, populate the service and provider details
        const requests = await Booking.find({ userId: userId })
            .populate({
                path: 'serviceId', // Correct path to populate service details
                select: 'name description category price address image provider', // Only the fields you want including provider reference
                populate: {
                    path: 'provider', // Populating the provider details inside service
                    model: 'Provider', // Make sure this matches the name of your Provider model
                    select: 'name phone email accountType image' // Select relevant provider fields
                }
            });

        res.status(200).json({ requests });
    } catch (err) {
        console.error('Error fetching requests:', err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Cancel a pending request
exports.cancelRequest = async (req, res) => {
    const { requestId } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // Verify token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.user.id;

        // Find the request by ID and check if it belongs to the user and is in 'Pending' status
        const request = await Booking.findOne({
            _id: requestId,
            userId: userId,
            status: 'Pending'
        });

        if (!request) {
            return res.status(404).json({ message: 'Pending request not found or you do not have permission to cancel it.' });
        }

        // Update the request status to 'Cancelled'
        request.status = 'Cancelled';
        await request.save();

        res.status(200).json({ message: 'Request cancelled successfully', request });
    } catch (err) {
        console.error('Error cancelling request:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};
