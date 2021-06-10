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

const authMiddleware = (req, res, next) => {
    const accessToken = req.cookies["access-token"];
    const refreshToken = req.cookies["refresh-token"];

    if (!refreshToken && !accessToken) {
        return next();
    }

    try {
        const data = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        req.user_id = data.user_id;
        return next();
    } catch {}

    if (!refreshToken) {
        return next();
    }

    let data;

    try {
        data = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
        return next();
    }

    const user = pool.query({
        text: "SELECT * FROM users WHERE user_id = $1",
        values: [data.user_id],
    });
    if (!user) {
        return next();
    }

    req.user_id = data.user_id;
    res.cookie("refresh-token", genRefreshToken(data.user_id));
    res.cookie("access-token", genAccessToken(data.user_id));

    next();
};

module.exports = { genRefreshToken, genAccessToken, authMiddleware };
