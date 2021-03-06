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

// for updating the meeting status and sending summary emails
export const COMPLETE_MEETING = gql`
  mutation updateMeeting($meetingId: uuid!, $emails: [String]!) {
    update_meeting(
      where: { id: { _eq: $meetingId } }
      _set: { status: "COMPLETE" }
    ) {
      affected_rows
    }

    update_meeting_member(
      where: {
        _and: [
          { meeting: { _eq: $meetingId } }
          { member_user: { email: { _in: $emails } } }
        ]
      }
      _set: { send_summary: true }
    ) {
      affected_rows
    }
  }
`;

export const SET_WAIT = gql`
  mutation setWait($wait: Boolean!) {
    setWait(wait: $wait) @client
  }
`;

export const GET_MEETING = gql`
  subscription getMeeting($meetingId: uuid!) {
    meeting(where: { id: { _eq: $meetingId } }) {
      name
      location
      start_dtm
      end_dtm
      agenda_items {
        id
        title
        desc
        duration
        completed
        order
      }
      meeting_members {
        send_agenda
        member_user {
          email
        }
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

export const CREATE_MEETING = gql`
  mutation createMeeting(
    $name: String
    $location: String
    $startDtm: timestamptz
    $endDtm: timestamptz
    $timezone: String
    $meetingMembers: meeting_member_arr_rel_insert_input
    $agendaItems: agenda_item_arr_rel_insert_input
  ) {
    insert_meeting(
      objects: [
        {
          name: $name
          location: $location
          start_dtm: $startDtm
          end_dtm: $endDtm
          timezone: $timezone
          meeting_members: $meetingMembers
          agenda_items: $agendaItems
        }
      ]
    ) {
      returning {
        id
      }
    }
  }
`;

export const CREATE_AGENDA_ITEM = gql`
  mutation createAgenda(
    $meetingId: uuid!
    $title: String!
    $desc: String
    $order: Int!
  ) {
    insert_agenda_item(
      objects: [
        { meeting_id: $meetingId, title: $title, desc: $desc, order: $order }
      ]
    ) {
      returning {
        id
      }
    }
  }
`;

export const UPDATE_AGENDA_ITEM_ORDER = gql`
  mutation updateAgendaItemOrder($id: Int!, $order: Int!) {
    update_agenda_item(where: { id: { _eq: $id } }, _set: { order: $order }) {
      returning {
        id
      }
    }
  }
`;
