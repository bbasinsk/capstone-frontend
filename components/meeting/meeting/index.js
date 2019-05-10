import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSubscription } from 'react-apollo-hooks';
import BasicInfo from '../basic-info';
import Agenda from '../agenda';
import EndModal from '../end-modal';
import { GET_MEETING } from '../../../queries';

const Meeting = ({ meetingId }) => {
  const [modalOpen, setModalOpen] = useState(false);

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
      <Agenda meetingId={meetingId} agendaItems={agendaItems} />
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
      />
    </div>
  );
};
Meeting.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default Meeting;
