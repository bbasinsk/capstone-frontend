import gql from 'graphql-tag';

export const UPDATE_MEETING = gql`
  mutation updateMeeting(
    $meetingId: uuid!
    $name: String
    $location: String
    $startDtm: timestamptz
    $endDtm: timestamptz
  ) {
    update_meeting(
      where: { id: { _eq: $meetingId } }
      _set: {
        name: $name
        location: $location
        start_dtm: $startDtm
        end_dtm: $endDtm
      }
    ) {
      affected_rows
    }
  }
`;

export const GET_MEETING = gql`
  subscription getMeeting($meetingId: uuid!) {
    meeting(where: { id: { _eq: $meetingId } }) {
      name
      location
      start_dtm
      end_dtm
    }
  }
`;
