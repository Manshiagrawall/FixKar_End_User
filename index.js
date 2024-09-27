const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const requestRoutes = require('./routes/requestRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const app = express();
const PORT = process.env.PORT || 5000;

const dbConnect = require('./config/dbConnect');

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/users', userRoutes);
app.use('/users', requestRoutes);
app.use('/users', serviceRoutes);
app.use('/users', reviewRoutes);

// Database connection and server start
dbConnect()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running at port ${PORT}`);
        });
    })
    .catch(error => {
        console.error("Error connecting to the database:", error);
        process.exit(1); 
    });