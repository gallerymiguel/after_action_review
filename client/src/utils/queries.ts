import {gql} from '@apollo/client';

export const GET_USER_MISSIONS = gql`
  query GetUserMissions {
    userMissions {
      _id
      missionName
      missionDate
      missionUnit
    }
  }
`;


export const GET_SINGLE_MISSION = gql`
  query GetMission($id: ID!) {
    mission(id: $id) {
      _id
      missionName
      missionDate
      missionUnit
      summary
      hero
      events {
        eventName
        sustainDetails
        improveDetailsArray {
          observation
          howToFix
          whoWillFix
          whenWillFix
        }
      }
    }
  }
`;
// export const GET_ME= gql`
//     query Me {
//         me {
//             _id
//             username
//             email
//             savedReports {
//             reportId
//             }}}`;