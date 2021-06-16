import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation LOGIN($email: String, $password: String) {
        login(email: $email, password: $password) {
            name
            email
            user_id
        }
    }
`;
