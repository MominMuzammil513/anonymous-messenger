import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};
const MONGODB_URI = process.env.MONGODB_URI
const connection: ConnectionObject = {};

const dbConnect = async ():Promise<void> => {
  if (connection.isConnected) {
    console.log("Already connected");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI||'',{})
    connection.isConnected = mongoose.connections[0].readyState;
    console.log("Connected to MongoDB successfully")

  } catch (error) {
    console.log("Database connection failed",error);
    process.exit(1)
  }
};
export default dbConnect