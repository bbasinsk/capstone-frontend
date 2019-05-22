import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Button, Divider, Alert, message } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const ShareModal = ({ visible, closeModal }) => (
  <div>
    <Modal visible={visible} onCancel={closeModal} footer={null}>
      <h1>Share Meeting </h1>
      <Alert
        message="Meetings are public"
        description="Anyone with the meeting URL can view the meeting and share with others."
        type="info"
        showIcon
      />
      <Divider />
      <CopyToClipboard
        text={window.location.href.split('?')[0]}
        onCopy={() => {
          message.open({
            content: 'Public link copied to clipboard',
            icon: <Icon type="snippets" />
          });
          closeModal();
        }}
      >
        <Button>
          <Icon type="link" /> Copy public link
        </Button>
      </CopyToClipboard>
    </Modal>
  </div>
);

ShareModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired
};

export default ShareModal;
