import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    me {
      _id
      username
      email
      role
      unit {
        _id
        name
      }
    }
  }
`;

export const GET_USER = gql`
  query GetUser($userId: ID!) {
    user(userId: $userId) {
      _id
      username
      email
      role
      unit {
        _id
        name
      }
    }
  }
`;