const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dktzov8.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`);
    console.log("✅ MongoDB connected.");
};

module.exports = connectDB;
