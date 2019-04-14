import React, { useState } from 'react';
import PropTypes from 'prop-types';
import BasicInfo from '../basic-info';
import Agenda from '../agenda';
import EndModal from '../end-modal';
import AgendaFooter from '../agenda-footer';

const Meeting = ({ meetingId }) => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <BasicInfo meetingId={meetingId} openModal={() => setModalOpen(true)} />
      <Agenda meetingId={meetingId} />
      <AgendaFooter
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
