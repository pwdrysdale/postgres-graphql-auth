const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");
const { pool } = require("./db");
const { authRoutes } = require("./routes");
const { notFound, errorHandler } = require("./errorHandling");
const { genAccessToken, genRefreshToken } = require("./utils/auth");
const jwt = require("jsonwebtoken");

dotenv.config();

const StartServer = async () => {
    // await mongoose.createConnection(process.env.MONGO_URI, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // });

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res }),
    });
    await server.start();

    const app = express();

    app.use(cookieParser());

    app.use(cors());
    app.use(express.json());

    app.use((req, res, next) => {
        const accessToken = req.cookies["access-token"];
        const refreshToken = req.cookies["refresh-token"];

        if (!refreshToken && !accessToken) {
            return next();
        }

        try {
            const data = jwt.verify(
                accessToken,
                process.env.ACCESS_TOKEN_SECRET
            );
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
    });

    server.applyMiddleware({ app });

    //app.use("/users", authRoutes);

    // these should go last surely!
    app.use(notFound);
    app.use(errorHandler);

    app.get("/", (req, res) => res.json({ key: "vals" }));

    await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
    console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );

    return { server, app };
};

StartServer();
