require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const mongoose = require("mongoose");

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    throw new Error("MONGODB_URI is missing from environment variables");
}

const mongooseOptions = {
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4
};

mongoose.connectionPromise = mongoose.connect(mongoURI, mongooseOptions)
    .then(() => {
        console.log("MongoDB Connected");
        console.log("Database:", mongoose.connection.name);
        return mongoose;
    })
    .catch(err => {
        console.error('MongoDB connection error:', err);
        throw err;
    });

// Optional: listen for runtime connection errors
mongoose.connection.on('error', err => {
    console.error('MongoDB runtime error:', err);
});

module.exports = mongoose;
