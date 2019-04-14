import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button } from 'antd';

const BasicInfo = ({ name, location, startDtm, endDtm, openModal }) => {
  const startDate = moment(startDtm).format('dddd, MMM Do');
  const start = moment(startDtm).format('h:mm a');
  const end = moment(endDtm).format('h:mm a');

  return (
    <div className="meeting-info">
      <div className="meeting-info--left">
        <h1 className="meeting-info__title">{name}</h1>

        <div className="meeting-info__dtm">
          <span className="meeting-info__date">{startDate},</span>
          <b className="meeting-info__time">
            {start} to {end}
          </b>
        </div>

        <div className="meeting-info__location">{location}</div>
      </div>

      <div className="meeting-info--right">
        <Button onClick={openModal} type="danger">
          END
        </Button>
      </div>

      <style jsx>{`
        .meeting-info {
          margin-bottom: 40px;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 32px;
        }

        .meeting-info__dtm {
          display: flex;
          flex-direction: row;
        }

        .meeting-info__time {
          margin-left: 8px;
        }

        .meeting-info__location {
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

BasicInfo.defaultProps = {
  name: '',
  location: '',
  startDtm: '',
  endDtm: ''
};

BasicInfo.propTypes = {
  name: PropTypes.string,
  location: PropTypes.string,
  startDtm: PropTypes.string,
  endDtm: PropTypes.string,
  openModal: PropTypes.func.isRequired
};

export default BasicInfo;
