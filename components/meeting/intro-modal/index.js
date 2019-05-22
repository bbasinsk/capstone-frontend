import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Icon } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const IntroModal = ({ visible, closeModal, emails }) => (
  <Modal
    visible={visible}
    bodyStyle={{ padding: 0, textAlign: 'center' }}
    onCancel={closeModal}
    width={580}
    footer={
      <Button type="primary" onClick={closeModal}>
        Close
      </Button>
    }
  >
    <div
      style={{
        background: '#eeeeee',
        borderRadius: '4px 4px 0 0'
      }}
    >
      <img
        style={{ height: '360px' }}
        src="/static/images/welcome.svg"
        alt="welcome"
      />
    </div>
    <div style={{ padding: '24px' }}>
      <h1>Welcome to your NeatMeet!</h1>
      <p style={{ color: 'gray' }}>{window.location.href.split('?')[0]}</p>
      {emails && emails.length > 0 && (
        <div>
          <p>
            <Icon type="check-circle" style={{ marginRight: 8 }} />
            <b>Invites with this URL have been sent to the following emails:</b>
          </p>
          <ul
            style={{
              margin: '0 0 16px 0',
              padding: 0,
              listStyle: 'none'
            }}
          >
            {emails.map(email => (
              <li style={{ marginBottom: 4 }} key={email}>
                <FontAwesomeIcon icon={['far', 'envelope']} /> {email}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p>
        Revisit your NeatMeet via URL to make collaborative edits at any time
        (i.e. your NeatMeet is accessible even after your meeting ends).
      </p>
      <p>
        When you’re ready, click{' '}
        <FontAwesomeIcon icon={['far', 'paper-plane']} /> to auto-generate a
        summary to send to your team.
      </p>
    </div>
  </Modal>
);
IntroModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  emails: PropTypes.arrayOf(PropTypes.string)
};
IntroModal.defaultProps = {
  emails: null
};

export default IntroModal;
