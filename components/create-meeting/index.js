import React, { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import { get } from 'lodash';
import { Router } from '../../routes';
import Component from './component';
import EmailModal from './email-modal';

const CREATE_MEETING = gql`
  mutation createMeeting(
    $name: String
    $location: String
    $startDtm: timestamptz
    $endDtm: timestamptz
    $agendaItems: agenda_item_arr_rel_insert_input
  ) {
    insert_meeting(
      objects: [
        {
          name: $name
          location: $location
          start_dtm: $startDtm
          end_dtm: $endDtm
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

export default function hoc() {
  const createMeetingMutation = useMutation(CREATE_MEETING);
  const [modalOpen, setModalOpen] = useState(false);
  const [meeting, setMeeting] = useState();

  const openConfirm = ({ name, location, startDtm, endDtm, agendaItems }) => {
    setModalOpen(true);
    setMeeting({ name, location, startDtm, endDtm, agendaItems });
  };

  const createMeeting = async ({
    name,
    location,
    startDtm,
    endDtm,
    agendaItems
  }) => {
    // create meeting in db
    const { data } = await createMeetingMutation({
      variables: { name, location, startDtm, endDtm, agendaItems }
    });
    // get meeting id
    const meetingId = get(data, 'insert_meeting.returning[0].id');
    // go to the meeting page
    Router.pushRoute('meeting', { meetingId });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: 'auto' }}>
      <Component createMeeting={openConfirm} />
      <EmailModal
        visible={modalOpen}
        closeModal={() => setModalOpen(false)}
        meeting={meeting}
        createMeeting={createMeeting}
      />
    </div>
  );
}
