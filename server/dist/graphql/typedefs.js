export const typeDefs = `#graphql
    type User {
        id: ID!
        username: String!
        email: String!
    }
    type Query {
        getUsers: [User]
        getUser(id: ID!): User
    }
    type Mutation {
        registerUser(username: String!, email: String!): User
        loginUser(email: String!, password: String!): User
    }
`;
