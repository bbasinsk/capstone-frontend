import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { useMutation } from 'react-apollo-hooks';
import moment from 'moment';
import { Router } from '../../../routes';
import { MeetingPropType } from '../../../constants/prop-types/meeting';
import SummaryEmail from '../../../shared/mailers/summary-email';
import { UPDATE_MEETING_STATUS } from '../../../queries';

const EndModal = ({ visible, closeModal, meeting }) => {
  const updateStatus = useMutation(UPDATE_MEETING_STATUS);

  const onOk = async () => {
    await updateStatus({
      variables: { meetingId: meeting.id, status: 'COMPLETE' }
    });
    Router.pushRoute('/complete');
  };

  const startDtm = moment(meeting.startDtm);
  const endDtm = moment(meeting.endDtm);
  const date = startDtm.format('L');
  const time = `${startDtm.format('LT')} - ${endDtm.format('LT z')}`;

  return (
    <div>
      <Modal
        title="Meeting Complete!"
        visible={visible}
        onOk={onOk}
        okText="Send"
        onCancel={closeModal}
        width={648}
      >
        <h1>Complete Meeting </h1>
        <SummaryEmail meeting={{ ...meeting, time, date }} isPreview />
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
