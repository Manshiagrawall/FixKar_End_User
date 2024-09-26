// const User = require('../models/User'); // Adjust the path as necessary
// const jwt = require('jsonwebtoken');

// // Get user details
// exports.getUser = async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     try {
//         // Verify token and get user id
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.user.id;

//         // Find the user
//         const user = await User.findById(userId).select('-password'); // Exclude password from response
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json(user);
//     } catch (err) {
//         console.error('Error fetching user:', err.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Update user details
// exports.updateUser = async (req, res) => {
//     const { name, email, location, gender } = req.body;
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     try {
//         // Verify token and get user id
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.user.id;

//         // Find the user
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update user details
//         if (name !== undefined) user.name = name;
//         if (email !== undefined) user.email = email;
//         if (location !== undefined) user.location = location;
//         if (gender !== undefined) user.gender = gender;

//         await user.save();
//         res.status(200).json({ message: 'User updated successfully', user });
//     } catch (err) {
//         console.error('Error updating user:', err.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// // Delete user account
// exports.deleteUser = async (req, res) => {
//     const token = req.headers.authorization?.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }

//     try {
//         // Verify token and get user id
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const userId = decoded.user.id;

//         // Find and delete the user
//         const user = await User.findByIdAndDelete(userId);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (err) {
//         console.error('Error deleting user:', err.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
