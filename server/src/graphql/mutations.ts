import { gql } from "@apollo/client";

export const REGISTER_USER = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      token
      user {
        _id
        username
        email
        role
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
        _id
        username
        email
        role
      }
    }
  }
`;
