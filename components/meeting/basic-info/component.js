import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Button, Typography, Icon } from 'antd';

const { Title, Text, Paragraph } = Typography;

const BasicInfo = ({
  name,
  location,
  startDtm,
  endDtm,
  openModal,
  openShare
}) => {
  const startDate = moment(startDtm).format('dddd, MMM Do');
  const start = moment(startDtm).format('h:mm a');
  const end = moment(endDtm).format('h:mm a');

  return (
    <div className="meeting-info">
      <div className="meeting-info__wrapper">
        <div className="meeting-info--left">
          <Title className="meeting-info__title">{name}</Title>

          <div className="meeting-info__dtm">
            <Paragraph>
              <Text className="meeting-info__date">{startDate}</Text>
              <br />
              <Text strong className="meeting-info__time">
                {start} to {end}
              </Text>
            </Paragraph>
          </div>

          <Paragraph
            className="meeting-info__location"
            style={{ fontSize: '16px' }}
          >
            <Text style={{ display: 'inline-block', marginBottom: '10px' }}>
              Location:
            </Text>
            <Text style={{ marginLeft: '6px' }}>{location}</Text>
          </Paragraph>
        </div>

        <div className="meeting-info--right">
          <Button
            size="large"
            onClick={openShare}
            type="primary"
            style={{ marginRight: '16px' }}
          >
            <Icon type="user" /> Share
          </Button>
          <Button size="large" onClick={openModal} type="danger">
            END
          </Button>
        </div>
      </div>
      <style jsx>{`
        .meeting-info {
          background: white;
        }

        .meeting-info__wrapper {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          padding: 32px;
          max-width: 1200px;
          margin: auto;
          margin-bottom: 40px;
        }

        .meeting-info--right {
          display: flex;
          align-items: center;
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
  openModal: PropTypes.func.isRequired,
  openShare: PropTypes.func.isRequired
};

export default BasicInfo;
