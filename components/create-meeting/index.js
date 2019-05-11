import React, { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';
import { get } from 'lodash';
import { Router } from '../../routes';
import Component from './component';
import EmailModal from './email-modal';
import { CREATE_MEETING } from '../../queries';
import { width } from '../../constants/styles';

export default function hoc() {
  const createMeetingMutation = useMutation(CREATE_MEETING);
  const [modalOpen, setModalOpen] = useState(false);
  const [meeting, setMeeting] = useState();

  const openConfirm = ({
    name,
    location,
    startDtm,
    endDtm,
    emails,
    agendaItems
  }) => {
    setModalOpen(true);
    setMeeting({ name, location, startDtm, endDtm, emails, agendaItems });
  };

  const createMeeting = async ({
    name,
    location,
    startDtm,
    endDtm,
    timezone,
    members,
    agendaItems
  }) => {
    // construct variables
    const variables = {
      name,
      location,
      startDtm,
      endDtm,
      timezone,
      agendaItems: {
        data: agendaItems.map((item, idx) => ({ ...item, order: idx + 1 }))
      },
      meetingMembers: {
        data: members.map(({ email, sendAgenda }) => ({
          member_user: {
            data: {
              email
            }
          },
          send_agenda: sendAgenda
        }))
      }
    };

    // create meeting in db
    const { data } = await createMeetingMutation({ variables });
    // get meeting id
    const meetingId = get(data, 'insert_meeting.returning[0].id');
    // go to the meeting page
    Router.pushRoute('meeting', { meetingId });
  };

  return (
    <div style={{ maxWidth: width, margin: 'auto' }}>
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
