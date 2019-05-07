import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useMutation } from 'react-apollo-hooks';
import { Router } from '../../../routes';
import { MeetingPropType } from '../../../constants/prop-types/meeting';
import SummaryEmail from '../../email-previews/summary-email';
import { UPDATE_MEETING_STATUS } from '../../../queries';

const EndModal = ({ visible, closeModal, meeting }) => {
  const updateStatus = useMutation(UPDATE_MEETING_STATUS);

  const onOk = async () => {
    await updateStatus({
      variables: { meetingId: meeting.id, status: 'COMPLETE' }
    });
    Router.pushRoute('/complete');
  };

  return (
    <div>
      <Modal
        title="Meeting Complete!"
        visible={visible}
        onOk={onOk}
        okText="Send"
        onCancel={closeModal}
      >
        <h1>Complete Meeting </h1>
        <SummaryEmail meeting={meeting} />
      </Modal>
    </div>
  );
};

EndModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  meeting: MeetingPropType.isRequired
};

export default EndModal;
