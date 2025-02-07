import { gql } from 'graphql-tag';

const typeDefs = gql`
  
  
  type User {
    _id: ID!
    username: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  input RegisterInput {
    username: String!
    password: String!
  }

  input LoginInput {
    username: String!
    password: String!
  }

  type Unit {
    _id: ID!
    name: String!
    missions: [Mission]!
    createdAt: String
    updatedAt: String
  }

  type Mission {
    _id: ID!
    name: String!
    startDate: String!
    endDate: String!
    unit: Unit!
    createdAt: String
    updatedAt: String
  }

  input CreateUnitInput {
    name: String!
  }

  input UpdateUnitInput {
    name: String
  }

  input CreateMissionInput {
    name: String!
    startDate: String!
    endDate: String!
    unitId: ID!
  }

  input UpdateMissionInput {
    name: String
    startDate: String
    endDate: String
    unitId: ID
  }

  type Query {
    me: User
    units: [Unit]!
    unit(id: ID!): Unit
    missions: [Mission]!
    mission(id: ID!): Mission
    missionsByUnit(unitId: ID!): [Mission]!
  }

  type Mutation {
    register(registerInput: RegisterInput!): Auth
    login(loginInput: LoginInput!): Auth
    createUnit(input: CreateUnitInput!): Unit
    updateUnit(id: ID!, input: UpdateUnitInput!): Unit
    deleteUnit(id: ID!): Unit
    createMission(input: CreateMissionInput!): Mission
    updateMission(id: ID!, input: UpdateMissionInput!): Mission
    deleteMission(id: ID!): Mission
  }
`;

export default typeDefs;