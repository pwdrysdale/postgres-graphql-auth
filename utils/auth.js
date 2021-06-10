const jwt = require("jsonwebtoken");

const genRefreshToken = (user_id) => {
    return jwt.sign({ user_id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
};
const genAccessToken = (user_id) => {
    return jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15min",
    });
};

module.exports = { genRefreshToken, genAccessToken };
