const mongoose = require("mongoose");
//const URI = "mongodb://localhost:27017/mern_admin";//
const URI = process.env.MONGODB_URI;

const connectDb = async () => {
  try {
    await mongoose.connect(URI);
    console.log("connection successfull to database");
  } catch (error) {
    console.error("database conncetion failed");
    process.exit(0);
  }
};

module.exports = connectDb;
