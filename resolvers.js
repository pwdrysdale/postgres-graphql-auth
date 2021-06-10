const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("./db");
const { genRefreshToken, genAccessToken } = require("./utils/auth");

const resolvers = {
    Query: {
        users: async () => {
            const data = await pool.query("SELECT * FROM users");

            return data.rows;
        },
        me: async (_, __, { req }) => {
            if (!req.user_id) {
                return null;
            }

            const user = await pool.query({
                text: "SELECT user_id, email, name FROM users WHERE user_id = $1",
                values: [req.user_id],
            });

            const { name, email, user_id } = user.rows[0];

            return { name, email, user_id };
        },
    },

    Mutation: {
        register: async (_, { email, password, name }, { res }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await pool.query({
                text: "INSERT INTO users (name, email, password) VALUES($1, $2, $3) RETURNING *;",
                values: [name, email, hashedPassword],
            });
            const { user_id } = user.rows[0];
            return { user_id, email, name };
        },

        login: async (_, { email, password }, { res }) => {
            const user = await pool.query({
                text: "SELECT * FROM users WHERE email = $1",
                values: [email],
            });

            if (!user) {
                return null;
            }

            const { user_id, name, password: actualPassword } = user.rows[0];

            const valid = await bcrypt.compare(password, actualPassword);

            if (!valid) {
                return null;
            }

            res.cookie("refresh-token", genRefreshToken(user_id));
            res.cookie("access-token", genAccessToken(user_id));

            return { user_id, name, email };
        },

        invalidateTokens: async (_, __, { req, res }) => {
            try {
                res.clearCookie("access-token");
                res.clearCookie("refresh-token");
                return true;
            } catch {
                return false;
            }
        },
    },
};

module.exports = { resolvers };
