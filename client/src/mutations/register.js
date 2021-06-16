import { gql } from "@apollo/client";

export const REGISTER = gql`
    mutation REGISTER($name: String, $email: String, $password: String) {
        register(name: $name, email: $email, password: $password) {
            name
            email
            user_id
        }
    }
`;
