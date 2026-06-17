const User = require("../models/User");

exports.protect = async (req, res, next) => {
    try {

        // 1. Get token from cookies
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Get user from token
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: "Not authorized, user not found" });
        }

        req.user = user;
        next();
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

