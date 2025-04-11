import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      token
      user {
        _id
        username
        email
      }
    }
  }
`;

export const ADD_REPORT = gql`
  mutation AddReport($input: ReportInput!) {
    addReport(input: $input) {
      _id
      report
      createdAt
    }
  }
`;

export const REMOVE_REPORT = gql`
  mutation RemoveReport($reportId: ID!) {
    removeReport(reportId: $reportId) {
      _id
      username
      email
      savedReports {
        _id
        report
      }
    }
  }
`;
