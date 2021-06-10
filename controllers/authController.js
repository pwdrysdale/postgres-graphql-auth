const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const { pool } = require("../db");
const { generateToken } = require("../utils/auth");

const newUser = asyncHandler(async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const exists = await pool.query({
            text: "SELECT email FROM users WHERE email = $1;",
            values: [email],
        });

        if (exists.rowCount > 0) {
            res.status(400).json({
                message: "A user with that email address already exists",
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await pool.query({
            text: "INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *;",
            values: [name, email, hashedPassword],
        });

        if (newUser.rows) {
            const token = generateToken(newUser.rows[0].id);
            res.cookie("jwt", token, {
                httpOnly: true,
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 3,
            });
        }

        res.status(200).json(newUser.rows[0]);

        return;
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query({
            text: "SELECT * FROM users WHERE email = $1",
            values: [email],
        });

        if (!user.rows[0]) {
            res.status(400).json({ message: "Does not exist, sorry!" });
            return;
        }

        const { password: hashedPassword, name, id } = user.rows[0];

        if (await !bcrypt.compare(password, hashedPassword)) {
            res.status(400).json({ message: "Incorrect password" });
        }

        const token = generateToken(id);

        res.cookie("jwt", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 3,
        });

        res.status(200).json(newUser.rows[0]);
    } catch (err) {
        res.status(500).json({ messsage: err.message });
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 1,
        });
        res.status(200).json({ message: "User logged out" });
    } catch (err) {
        res.status(500).json({ message: "Could not log off - server error" });
    }
});

const allUsers = asyncHandler(async (req, res) => {
    try {
        const users = await pool.query("SELECT * FROM users");
        res.status(200).json(users.rows);
        return;
    } catch (err) {
        throw new Error(err.message);
    }
});

module.exports = { allUsers, newUser, loginUser, logoutUser };
