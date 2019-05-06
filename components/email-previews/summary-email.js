import React from 'react';
import moment from 'moment';
import { MeetingPropType } from '../../constants/prop-types/meeting';

const SummaryEmail = ({ meeting }) => (
  <div className="email__outer-wrapper">
    <div className="email__info">
      <h2>Summary: {meeting.name}</h2>
      <div>{moment(meeting.startDtm).format('L')}</div>
      <div>
        {`${moment(meeting.startDtm).format('LT')} - ${moment(
          meeting.endDtm
        ).format('LT')}`}
      </div>
      <div>{meeting.location}</div>
    </div>

    <div>
      {meeting.agendaItems.map((item, idx) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={idx}>
          <h3>{item.title}</h3>
          <p>{item.desc}</p>
        </div>
      ))}
    </div>

    <style>{`
      .email__outer-wrapper {
        box-shadow: 0 0 0 rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(0, 0, 0, 0.2);
        padding: 24px;
      }
  
      .email__info {
        text-align: center;
        margin-bottom: 24px;
      }
    `}</style>
  </div>
);
SummaryEmail.propTypes = {
  meeting: MeetingPropType.isRequired
};

export default SummaryEmail;
