import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSubscription } from 'react-apollo-hooks';
import sharedb from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnecting-websocket';
import richText from 'rich-text';
import BasicInfo from '../basic-info';
import Agenda from '../agenda';
import EndModal from '../end-modal';
import { GET_MEETING } from '../../../queries';

sharedb.types.register(richText.type);

const Meeting = ({ meetingId }) => {
  const [modalOpen, setModalOpen] = useState(false);
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
    agendaItems
  };

  return (
    <div>
      <BasicInfo meeting={meeting} openModal={() => setModalOpen(true)} />
      <Agenda
        meetingId={meetingId}
        agendaItems={agendaItems}
        connection={connection}
      />
      {/* <AgendaFooter
        agendaItems={agendaItems}
        openModal={() => {
          setModalOpen(true);
        }}
      /> */}
      <EndModal
        visible={modalOpen}
        closeModal={() => setModalOpen(false)}
        meeting={meeting}
        connection={connection}
      />
    </div>
  );
};
Meeting.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default Meeting;
