import { gql } from "graphql-tag";

const typeDefs = gql`
  enum Role {
    EVALUATOR
    USER
  }

  type User {
    _id: ID!
    username: String!
    email: String
    role: Role!
  }

  type Unit {
    _id: ID!
    name: String!
    missions: [Mission]!
    createdAt: String
    updatedAt: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
    role: Role = USER
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ImproveInput {
    observation: String
    howToFix: String
    whoWillFix: String
    whenWillFix: String
  }

  input MissionInput {
    missionName: String
    missionDate: String
    missionUnit: String
    summary: String
    hero: String
    events: [EventInput]
  }

  input EventInput {
    eventName: String
    sustainDetails: [String]
    improveDetailsArray: [ImproveInput]
  }

  type Improvement {
    observation: String
    howToFix: String
    whoWillFix: String
    whenWillFix: String
  }

  type Event {
    eventName: String
    sustainDetails: [String]
    improveDetailsArray: [Improvement]
  }

  type Mission {
    _id: ID!
    missionName: String
    missionDate: String
    missionUnit: String
    summary: String
    hero: String
    events: [Event]
    user: ID!
    createdAt: String
    updatedAt: String
  }

  type Query {
  me: User
  users: [User]              
  user(userId: ID!): User    
  units: [Unit]              
  unit(id: ID!): Unit   
  userMissions: [Mission]!     
  missions: [Mission]        
  mission(id: ID!): Mission  
  missionsByUnit(unitId: ID!): [Mission] 
}


  type Mutation {
    register(registerInput: RegisterInput!): Auth
    login(loginInput: LoginInput!): Auth
    saveMission(input: MissionInput!): Mission
  }
`;

export default typeDefs;
