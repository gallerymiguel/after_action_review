import {gql} from '@apollo/client';

export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }}}`;

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
      }}}`;

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