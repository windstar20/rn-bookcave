import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protectRoute = async (req, res, next) => {
    try {
        //get token
        const token = req.header("Authorization").replace("Bearer ", "");
        if(!token) return res.status(401).json({msg: "No token provided"});

        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // find user
        const user = await User.findById(decoded.userId).select("-password");
        if(!user) return res.status(401).json({msg: "User not found"});

        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({msg: "Not authorized"});
    }
}

export default protectRoute;
