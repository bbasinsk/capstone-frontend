import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { Router } from '../../../routes';
import { MeetingPropType } from '../../../constants/prop-types/meeting';
import SummaryEmail from '../../../shared/mailers/summary-email';
import { UPDATE_MEETING_STATUS } from '../../../queries';

class EndModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    meeting: MeetingPropType.isRequired,
    connection: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      notesHtml: []
    };
  }

  componentDidUpdate(prevProps) {
    // when the modal is opened, get notes and update state
    if (this.props.visible && !prevProps.visible) {
      this.getNotes().then(notesHtml => {
        this.setState({ notesHtml });
      });
    }
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
          />
        )
      }))
    };

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
              <SummaryEmail meeting={meetingPreview} isPreview />
            </Modal>
          </div>
        )}
      </Mutation>
    );
  }
}

export default EndModal;
