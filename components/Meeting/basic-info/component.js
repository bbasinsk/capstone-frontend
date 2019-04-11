import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const BasicInfo = ({ name, location, startDtm, endDtm }) => {
  const startDate = moment(startDtm).format('dddd, MMM Do');
  const start = moment(startDtm).format('h:mm a');
  const end = moment(endDtm).format('h:mm a');

  return (
    <div>
      <h1>{name}</h1>
      <div>{startDate}</div>
      <div>
        {start} to {end}
      </div>
      <div>{location}</div>
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
  endDtm: PropTypes.string
};

export default BasicInfo;
