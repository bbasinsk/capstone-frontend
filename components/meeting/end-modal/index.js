import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { Router } from '../../../routes';

const EndModal = ({ visible, closeModal }) => {
  const onOk = () => {
    Router.pushRoute('/complete');
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
        <b>Meeting summaries coming soon!</b>
      </Modal>
    </div>
  );
};

EndModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default EndModal;
