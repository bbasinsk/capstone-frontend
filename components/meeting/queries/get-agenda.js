import gql from 'graphql-tag';

export default gql`
  subscription getMeeting($meetingId: uuid!) {
    meeting(where: { id: { _eq: $meetingId } }) {
      agenda_items {
        id
        title
        desc
        duration
        completed
      }
    }
  }
`;
