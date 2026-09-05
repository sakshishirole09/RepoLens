const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Trying MongoDB connection...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Mongo Error:");
    console.error(error.message);
  }
};

module.exports = connectDB;