import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({
        userId
    }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });
};

router.post("/register", async (req, res) => {
    console.log(req.body);

    try {
        const {email, username, password} = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({message: "All fields are required"});
        }
        if (password.length < 6) {
            return res.status(400).json({message: "Password must be at least 6 characters"});
        }
        if (username.length < 3) {
            return res.status(400).json({message: "Username must be at least 3 characters"});
        }

        // check if user already exists
        // const existingUser = await User.findOne({
        //     $or: [{email}, {username}]
        // });
        // if (existingUser) {
        //     return res.status(400).json({message: "User already exists"});
        // }

        const existingEmail = await User.findOne({email});
        if (existingEmail) {
            return res.status(400).json({message: "Email already exists"});
        }
        const existingUsername = await User.findOne({username});
        if (existingUsername) {
            return res.status(400).json({message: "Username already exists"});
        }

        //get random avatar : diceVBear
        // const profileImage = `https://avatars.dicebear.com/api/avataaars/${username}.svg`;
        const profileImage = `https://api.dicebear.com/9.x/avataaars/svg?seed=${username}`;

        const user = new User({
            email,
            username,
            password,
            profileImage: profileImage,
        });

        await user.save();

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });


    } catch (error) {
        console.log(`Error in register: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }

    res.send("register");
});

router.post("/login", async (req, res) => {
    console.log(req.body);

    try {
        const {email, password} = req.body;
        if (!email || !password)
            return res.status(400).json({message: "All fields are required"});

        //check if user exists
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "Invalid credentials: user does not exist"});

        //check if password is correct
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect)
            return res.status(400).json({message: "Invalid credentials: password is not incorrect"});

        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
            }
        });
    } catch (error) {
        console.log(`Error in login: ${error}`);
        res.status(500).json({message: "Internal server error"});
    }
    res.send("login");
});

export default router;
