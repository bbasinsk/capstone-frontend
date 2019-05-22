import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSubscription } from 'react-apollo-hooks';
import sharedb from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnecting-websocket';
import richText from 'rich-text';
import BasicInfo from '../basic-info';
import Agenda from '../agenda';
import ShareModal from '../share-modal';
import IntroModal from '../intro-modal';
import { GET_MEETING } from '../../../queries';

sharedb.types.register(richText.type);

const Meeting = ({ meetingId, showModal }) => {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [introModalOpen, setIntroModalOpen] = useState(!!showModal);
  const [connection, setConnection] = useState();

  useEffect(() => {
    const socket = new ReconnectingWebSocket(
      (window.location.protocol === 'http:' ? 'ws://' : 'wss://') +
        window.location.host
    );
    setConnection(new sharedb.Connection(socket));
  }, []);

  const { data: { meeting: meetings } = {}, loading, error } = useSubscription(
    GET_MEETING,
    {
      variables: { meetingId }
    }
  );
  if (error) return <div>Error! {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  const { agenda_items: agendaItems } = meetings[0];

  const meeting = {
    id: meetingId,
    name: meetings[0].name,
    location: meetings[0].location,
    startDtm: meetings[0].start_dtm,
    endDtm: meetings[0].end_dtm,
    agendaItems: meetings[0].agenda_items,
    members: meetings[0].meeting_members
  };

  return (
    <div>
      <BasicInfo meeting={meeting} openModal={() => setShareModalOpen(true)} />
      <Agenda
        meetingId={meetingId}
        agendaItems={agendaItems}
        connection={connection}
      />
      {/* <AgendaFooter
        agendaItems={agendaItems}
        openModal={() => {
          setEndModalOpen(true);
        }}
      /> */}
      <IntroModal
        visible={introModalOpen}
        closeModal={() => setIntroModalOpen(false)}
        emails={meeting.members
          .filter(member => member.send_agenda)
          .map(member => member.member_user.email)}
      />
      <ShareModal
        visible={shareModalOpen}
        closeModal={() => setShareModalOpen(false)}
        meeting={meeting}
        connection={connection}
      />
    </div>
  );
};
Meeting.propTypes = {
  meetingId: PropTypes.string.isRequired,
  showModal: PropTypes.string
};
Meeting.defaultProps = {
  showModal: ''
};

export default Meeting;
