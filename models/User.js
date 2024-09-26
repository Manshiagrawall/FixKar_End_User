// userModel.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Existing fields...
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    location: {
        country: String,
        state: String,
        city: String,
        locality: String
    },
    gender: { type: String, required: true },
    // Optionally reference bookings
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }]
});

module.exports = mongoose.model('User', userSchema);
