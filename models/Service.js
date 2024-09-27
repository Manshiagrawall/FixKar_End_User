const mongoose = require('mongoose');

// Define the Service schema
const serviceSchema = new mongoose.Schema({
    provider: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Provider',  // Reference to the Provider model
        required: true 
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    address: { type: String, required: true },
    image: { type: String }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

// Export the Service model
module.exports = mongoose.model('Service', serviceSchema);
