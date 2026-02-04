import mongoose from "mongoose";

const connectDB = async (mongoUri) => {
  const connection = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

export default connectDB;
