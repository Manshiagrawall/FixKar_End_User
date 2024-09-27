// const Service = require('../models/Service');
// const jwt = require('jsonwebtoken');

// // Get all services for users
// exports.getAllServices = async (req, res) => {
//   // const token = req.headers.authorization?.split(' ')[1];

//   // if (!token) {
//   //   return res.status(401).json({ message: 'No token provided' });
//   // }

//   try {
//     // Verify the token (commented out)
//     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // Optionally, you can retrieve user information from the decoded token if needed

//     const services = await Service.find();
//     res.status(200).json({ services });
//   } catch (err) {
//     console.error('Error fetching services:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // Get a specific service by ID
// exports.getServiceById = async (req, res) => {
//   // const token = req.headers.authorization?.split(' ')[1];
//   const { id } = req.params; // Service ID

//   // if (!token) {
//   //   return res.status(401).json({ message: 'No token provided' });
//   // }

//   try {
//     // Verify the token (commented out)
//     // const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     // Optionally, you can retrieve user information from the decoded token if needed

//     const service = await Service.findById(id);
//     if (!service) {
//       return res.status(404).json({ message: 'Service not found' });
//     }

//     res.status(200).json(service);
//   } catch (err) {
//     console.error('Error fetching service:', err.message);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

const Service = require('../models/Service');
const Provider = require('../models/providerModel');
const Review = require('../models/reviewModel');
const jwt = require('jsonwebtoken');


// Get all services for users, including only rating and comment from reviews
exports.getAllServices = async (req, res) => {
  try {
    // Fetch services and populate provider details from the Provider model
    const services = await Service.find()
      .populate('provider', 'name phone email accountType image')  // Populate provider fields
      .lean();  // Use lean() for better performance

    // Get reviews for each service and attach them to the service data
    const servicesWithReviews = await Promise.all(
      services.map(async (service) => {
        const reviews = await Review.find({ serviceId: service._id }, 'rating comment');  // Fetch only rating and comment
        return { ...service, reviews };  // Attach reviews to the service object
      })
    );

    // Return the services with attached reviews and provider details
    res.status(200).json(servicesWithReviews);
  } catch (err) {
    console.error('Error fetching services:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
// Get a specific service by ID, including only rating and comment from reviews
exports.getServiceById = async (req, res) => {
  const { id } = req.params; // Service ID

  try {
    const service = await Service.findById(id).lean();
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Fetch only rating and comment for the specific service's reviews
    const reviews = await Review.find({ serviceId: id }, 'rating comment');

    res.status(200).json({ ...service, reviews });  // Attach reviews to the service response
  } catch (err) {
    console.error('Error fetching service:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
