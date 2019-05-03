import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { MeetingPropType } from '../../constants/prop-types/meeting';
import ShareEmail from '../email-previews/share-email';

const EndModal = ({ visible, closeModal, meeting, createMeeting }) => {
  const onOk = () => {
    createMeeting(meeting);
  };

  return (
    <div>
      <Modal
        title={`Share Agenda: ${meeting.name}`}
        visible={visible}
        onOk={onOk}
        okText="Share"
        onCancel={closeModal}
      >
        <h2>Preview </h2>
        <ShareEmail meeting={meeting} />
      </Modal>
    </div>
  );
};

EndModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  meeting: MeetingPropType,
  createMeeting: PropTypes.func.isRequired
};
EndModal.defaultProps = {
  meeting: {
    name: 'Capstone Meeting',
    location: 'Online',
    startDtm: '2019-05-11T03:20:19.000Z',
    endDtm: '2019-05-11T04:20:19.000Z',
    emails: ['bbasinsk@uw.edu'],
    agendaItems: [
      {
        title: 'Item one',
        desc: 'description'
      }
    ]
  }
};

export default EndModal;
