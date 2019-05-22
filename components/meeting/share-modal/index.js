import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Checkbox, Divider } from 'antd';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { Router } from '../../../routes';
import { MeetingPropType } from '../../../constants/prop-types/meeting';
import SummaryEmail from '../../../shared/mailers/summary-email';
import { COMPLETE_MEETING } from '../../../queries';

class ShareModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    meeting: MeetingPropType.isRequired,
    connection: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      notesHtml: [],
      checkState: {}
    };
  }

  componentDidUpdate(prevProps) {
    // when the modal is opened, get notes and update state
    if (this.props.visible && !prevProps.visible) {
      this.getNotes().then(notesHtml => {
        this.setState({
          notesHtml,
          checkState: {
            checkedList: this.emails || [],
            indeterminate: false,
            checkAll: true
          }
        });
      });
    }
  }

  get emails() {
    return this.props.meeting.members.map(member => member.member_user.email);
  }

  getNotes = async () =>
    Promise.all([
      ...this.props.meeting.agendaItems.map(item => {
        const doc = this.props.connection.get('agenda_notes', `${item.id}`);

        // fetch note data
        return new Promise((resolve, reject) => {
          doc.fetch(err => {
            if (err) reject(err);

            const converter = new QuillDeltaToHtmlConverter(doc.data.ops, {});
            resolve(converter.convert());
          });
        });
      })
    ]);

  onChange = newCheckedList => {
    this.setState({
      checkState: {
        checkedList: newCheckedList,
        indeterminate:
          !!newCheckedList.length && newCheckedList.length < this.emails.length,
        checkAll: newCheckedList.length === this.emails.length
      }
    });
  };

  onCheckAllChange = e => {
    this.setState({
      checkState: {
        checkedList: e.target.checked ? this.emails : [],
        indeterminate: false,
        checkAll: e.target.checked
      }
    });
  };

  onOk = async updateStatus => {
    await updateStatus({
      variables: {
        meetingId: this.props.meeting.id,
        emails: this.state.checkState.checkedList
      }
    });
    Router.pushRoute('/complete');
  };

  render() {
    const { visible, closeModal, meeting } = this.props;
    const startDtm = moment(meeting.startDtm);
    const endDtm = moment(meeting.endDtm);
    const date = startDtm.format('L');
    const time = `${startDtm.format('LT')} - ${endDtm.format('LT z')}`;
    const options = this.emails || [];

    const meetingPreview = {
      ...meeting,
      time,
      date,
      agendaItems: meeting.agendaItems.map((agendaItem, idx) => ({
        ...agendaItem,
        Notes: (
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: this.state.notesHtml[idx] }}
            style={{
              borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
              paddingLeft: '16px'
            }}
          />
        )
      }))
    };

    return (
      <Mutation mutation={COMPLETE_MEETING}>
        {updateStatus => (
          <div>
            <Modal
              visible={visible}
              onOk={() => this.onOk(updateStatus)}
              okText="Send"
              onCancel={closeModal}
              width={648}
            >
              <h1>Share Summary</h1>
              <SummaryEmail meeting={meetingPreview} isPreview />

              <h2 style={{ marginTop: 16 }}>Summary Preview</h2>
              <div>
                <Checkbox
                  indeterminate={this.state.checkState.indeterminate}
                  onChange={this.onCheckAllChange}
                  checked={this.state.checkState.checkAll}
                >
                  Check all
                </Checkbox>

                <Divider style={{ margin: '14px 0' }} />

                <Checkbox.Group
                  style={{ display: 'flex', flexDirection: 'column' }}
                  options={options}
                  value={this.state.checkState.checkedList}
                  onChange={this.onChange}
                />
              </div>
            </Modal>
          </div>
        )}
      </Mutation>
    );
  }
}

export default ShareModal;
