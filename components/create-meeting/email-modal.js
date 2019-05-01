import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const EndModal = ({ visible, closeModal, meeting, createMeeting }) => {
  const onOk = () => {
    createMeeting(meeting);
  };

  return (
    <div>
      <Modal
        title="Meeting Agenda"
        visible={visible}
        onOk={onOk}
        onCancel={closeModal}
      >
        <h1>Confirm Agenda? </h1>
        <pre>{JSON.stringify(meeting, null, 3)}</pre>
      </Modal>
    </div>
  );
};

EndModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  meeting: PropTypes.any,
  createMeeting: PropTypes.func.isRequired
};
EndModal.defaultProps = {
  meeting: {}
};

export default EndModal;
