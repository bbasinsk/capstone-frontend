import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import { Router } from '../../../routes';
import { MeetingPropType } from '../../../constants/prop-types/meeting';
import SummaryEmail from '../../../shared/mailers/summary-email';
import { UPDATE_MEETING_STATUS } from '../../../queries';

class EndModal extends React.Component {
  onOk = async updateStatus => {
    await updateStatus({
      variables: { meetingId: this.props.meeting.id, status: 'COMPLETE' }
    });
    Router.pushRoute('/complete');
  };

  render() {
    const { visible, closeModal, meeting } = this.props;
    const startDtm = moment(meeting.startDtm);
    const endDtm = moment(meeting.endDtm);
    const date = startDtm.format('L');
    const time = `${startDtm.format('LT')} - ${endDtm.format('LT z')}`;

    return (
      <Mutation mutation={UPDATE_MEETING_STATUS}>
        {updateStatus => (
          <div>
            <Modal
              title="Meeting Complete!"
              visible={visible}
              onOk={() => this.onOk(updateStatus)}
              okText="Send"
              onCancel={closeModal}
              width={648}
            >
              <h1>Complete Meeting </h1>
              <SummaryEmail meeting={{ ...meeting, time, date }} isPreview />
            </Modal>
          </div>
        )}
      </Mutation>
    );
  }
}

EndModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  meeting: MeetingPropType.isRequired
};

export default EndModal;
