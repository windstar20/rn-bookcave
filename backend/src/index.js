import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import {connectDB} from "./lib/db.js";

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;


app.use("/api/auth", authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`MONGO_URI is ${process.env.MONGO_URI ? 'defined' : 'undefined'}`);
    connectDB();
});
