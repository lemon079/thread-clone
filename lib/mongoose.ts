import mongoose from "mongoose";

let isConnected = false; // to check if mongoose is connected to DB

export const connectToDB = async () => {
  mongoose.set("strictQuery", true); // to prevent unknown field queries

  if (!process.env.MONGODB_URL) return console.log("MONGODB URL NOT FOUND");
  if (isConnected) return console.log("ALREADY CONNECTED TO MONGODB");

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};
