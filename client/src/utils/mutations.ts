import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
  mutation Login($loginInput: LoginInput!) {
  login(loginInput: $loginInput) {
    token
    user {
      _id
      username
    }
  }
}`;

export const ADD_USER = gql`
  mutation Register($registerInput: RegisterInput!) {
  register(registerInput: $registerInput) {
    token
    user {
      _id
      username
    }
  }
}`;

export const ADD_REPORT = gql`
    mutation AddReport($report: String!) {
    addReport(report: $report) {
    token
    report {
        _id
        }}}`;

export const REMOVE_REPORT = gql`
    mutation RemoveReport($reportId: String!) {
        removeReport(reportId: $reportId) {
            _id
            username
            email
            savedReports {
            reportId
        }}}`;