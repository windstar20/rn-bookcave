import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;


app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`MONGO_URI is ${process.env.MONGO_URI ? 'defined' : 'undefined'}`);
    connectDB();
});
