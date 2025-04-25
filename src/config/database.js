const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://durgeskp:mongodbcool@cluster0.dktzov8.mongodb.net/devConn");
};

module.exports = connectDB;