const express = require("express");
const authRoutes = express.Router();

const {
    allUsers,
    newUser,
    loginUser,
    logoutUser,
} = require("./controllers/authController");

authRoutes.route("/").post(newUser).get(allUsers);
authRoutes.route("/login").post(loginUser).get(logoutUser);

module.exports = { authRoutes };
