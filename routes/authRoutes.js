const express = require("express");
const { register, login, logout } = require("../controllers/authController");

const router = express.Router();

// ================== Public Routes ==================
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;