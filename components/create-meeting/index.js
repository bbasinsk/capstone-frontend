import React, { useState } from 'react';
import { useMutation } from 'react-apollo-hooks';
import { get } from 'lodash';
import moment from 'moment-timezone';
import { Router } from '../../routes';
import Component from './component';
import ConfirmModal from './confirm-modal';
import WelcomeModal from './welcome-modal';
import { CREATE_MEETING } from '../../queries';
import { width } from '../../constants/styles';

const DTM_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

export default function hoc() {
  const createMeetingMutation = useMutation(CREATE_MEETING);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(true);
  const [meeting, setMeeting] = useState();

  const openConfirm = newMeeting => {
    setConfirmModalOpen(true);
    setMeeting(newMeeting);
  };

  const createMeeting = async ({
    name,
    location,
    localStartDtm,
    localEndDtm,
    timezone,
    members,
    agendaItems
  }) => {
    const startDtm = moment(localStartDtm, DTM_FORMAT, timezone).toISOString();
    const endDtm = moment(localEndDtm, DTM_FORMAT, timezone).toISOString();

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
      <ConfirmModal
        visible={confirmModalOpen}
        closeModal={() => setConfirmModalOpen(false)}
        meeting={
          meeting && {
            ...meeting,
            startDtm: meeting.localStartDtm,
            endDtm: meeting.localEndDtm
          }
        }
        createMeeting={createMeeting}
      />
      <WelcomeModal
        visible={welcomeModalOpen}
        closeModal={() => setWelcomeModalOpen(false)}
      />
    </div>
  );
}
