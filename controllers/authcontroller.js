const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const cookieOptions = require("../utils/cookieOptions");
const jwt = require("jsonwebtoken");

// =================== REGISTER USER =================== //
const registerUser = async (req, res) => {
  try {
      const { name, email, password, name } = req.body;
      
      // 1. check if user already exists
      const userExists = await User.findOne({ email });
      
      if (userExists) {
          return res.status(400).json({ message: "User already exists" });
      }

      // 2. create new user
      const user = await User.create({ name, email, password, phone });

      // 3. generate JWT
      const token = generateToken(user._id);

      // 4. send cookie
      res.cookie("token", token, cookieOptions);

      // 5. send response
      res.status(200).json({ 
          message: "User registered successfully",
          user: {
              id: user._id,
              name: user.name,
              email: user.email,
          },
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registerUser };
