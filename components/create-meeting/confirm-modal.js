import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Modal, Checkbox, Divider } from 'antd';
import { MeetingPropType } from '../../constants/prop-types/meeting';
import ShareEmail from '../../shared/mailers/share-email';

const ConfirmModal = ({ visible, closeModal, meeting, createMeeting }) => {
  const options = meeting.emails || [];
  const meetingInTz = {
    ...meeting,
    date: moment(meeting.startDtm).format('L'),
    time: `${moment(meeting.startDtm).format('LT')} - ${moment(
      meeting.endDtm
    ).format('LT z')}`
  };

  const [checkState, setCheckState] = useState({
    checkedList: options,
    indeterminate: true,
    checkAll: false
  });

  const onChange = newCheckedList => {
    setCheckState({
      checkedList: newCheckedList,
      indeterminate:
        !!newCheckedList.length && newCheckedList.length < options.length,
      checkAll: newCheckedList.length === options.length
    });
  };

  const onCheckAllChange = e => {
    setCheckState({
      checkedList: e.target.checked ? options : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  };

  const onOk = () => {
    const members = options.map(email => ({
      email,
      sendAgenda: checkState.checkedList.includes(email)
    }));

    createMeeting({ ...meeting, members });
  };

  return (
    <div>
      <Modal
        title={`Share Agenda: ${meeting.name}`}
        visible={visible}
        onOk={onOk}
        okText={checkState.checkedList.length ? 'Share and Create' : 'Create'}
        onCancel={closeModal}
        width={648}
      >
        <h2>Preview</h2>
        <ShareEmail meeting={meetingInTz} isPreview />

        <h2 style={{ marginTop: 16 }}>Share Invitations</h2>
        <div>
          <Checkbox
            indeterminate={checkState.indeterminate}
            onChange={onCheckAllChange}
            checked={checkState.checkAll}
          >
            Check all
          </Checkbox>

          <Divider style={{ margin: '14px 0' }} />

          <Checkbox.Group
            style={{ display: 'flex', flexDirection: 'column' }}
            options={options}
            value={checkState.checkedList}
            onChange={onChange}
          />
        </div>
      </Modal>
    </div>
  );
};

ConfirmModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  meeting: MeetingPropType,
  createMeeting: PropTypes.func.isRequired
};
ConfirmModal.defaultProps = {
  meeting: {
    name: '',
    location: '',
    startDtm: '',
    endDtm: '',
    emails: [],
    agendaItems: []
  }
};

export default ConfirmModal;
