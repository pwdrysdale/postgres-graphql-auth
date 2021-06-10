const { gql } = require("apollo-server-express");

const typeDefs = gql`
    type User {
        name: String
        email: String
        user_id: Float
        password: String
    }

    type AnonUser {
        name: String
        email: String
        user_id: Float
    }

    type Query {
        users: [User]
        me: User
    }

    type Mutation {
        login(email: String, password: String): AnonUser
        register(email: String, password: String, name: String): AnonUser
        invalidateTokens: Boolean
    }
`;

module.exports = { typeDefs };
