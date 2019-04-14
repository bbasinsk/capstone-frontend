import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

const EndModal = ({ visible, closeModal }) => {
  const onOk = () => {
    console.log('done');
    closeModal();
  };

  return (
    <div>
      <Modal
        title="Complete Meeting"
        visible={visible}
        onOk={onOk}
        onCancel={closeModal}
      >
        <h1>Complete your meeting? </h1>
        <b>Meeting summaries comming soon!</b>
      </Modal>
    </div>
  );
};

EndModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default EndModal;
