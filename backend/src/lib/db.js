import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
    try {
        console.log("db.js", process.env.MONGO_URI);
        const conn = await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.log(error);
        process.exit(1); //exit with failure
    }
};
