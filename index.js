const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

const { typeDefs } = require("./typeDefs");
const { resolvers } = require("./resolvers");
const { authMiddleware } = require("./utils/auth");

dotenv.config();

const StartServer = async () => {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: ({ req, res }) => ({ req, res }),
    });
    await server.start();

    const app = express();

    app.use(cookieParser());
    app.use(authMiddleware);

    server.applyMiddleware({ app });

    await new Promise((resolve) => app.listen({ port: 4000 }, resolve));
    console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );

    return { server, app };
};

StartServer();
