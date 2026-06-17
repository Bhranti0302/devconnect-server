const express = require("express");
const { register, login, logout } = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ================== Public Routes ==================
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// ================== Protected Routes ==================
router.get("/me", protect, (req, res) => res.status(200).json(req.user));

module.exports = router;