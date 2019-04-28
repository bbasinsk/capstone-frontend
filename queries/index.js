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

export const SET_WAIT = gql`
  mutation setWait($wait: Boolean!) {
    setWait(wait: $wait) @client
  }
`;

export const GET_AGENDA = gql`
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

export const GET_WAIT = gql`
  query GetWait {
    wait @client
  }
`;

export const DELETE_AGENDA_ITEM = gql`
  mutation deleteItem($id: Int!) {
    delete_agenda_item(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export const SET_ITEM_COMPLETE = gql`
  mutation setItemComplete($id: Int!, $completed: Boolean!) {
    update_agenda_item(
      where: { id: { _eq: $id } }
      _set: { completed: $completed }
    ) {
      affected_rows
    }
  }
`;