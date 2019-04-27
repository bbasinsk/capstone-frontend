import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSubscription } from 'react-apollo-hooks';
import BasicInfo from '../basic-info';
import Agenda from '../agenda';
import EndModal from '../end-modal';
import AgendaFooter from '../agenda-footer';
import { GET_AGENDA } from '../../../queries';

const Meeting = ({ meetingId }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { data: { meeting: meetings } = {}, loading, error } = useSubscription(
    GET_AGENDA,
    {
      variables: { meetingId }
    }
  );
  if (error) return <div>Error! {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  const { agenda_items: agendaItems } = meetings[0];

  return (
    <div>
      <BasicInfo meetingId={meetingId} openModal={() => setModalOpen(true)} />
      <Agenda meetingId={meetingId} agendaItems={agendaItems} />
      <AgendaFooter
        agendaItems={agendaItems}
        openModal={() => {
          setModalOpen(true);
        }}
      />
      <EndModal visible={modalOpen} closeModal={() => setModalOpen(false)} />
    </div>
  );
};
Meeting.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default Meeting;
