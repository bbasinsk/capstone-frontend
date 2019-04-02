import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import moment from 'moment';

const GET_MEETING = gql`
  query getMeeting($meetingId: uuid!) {
    meeting(where: { meeting_id: { _eq: $meetingId } }) {
      name
      location
      start_dtm
      end_dtm
    }
  }
`;

function BasicInfo({ meetingId }) {
  const {
    data: { meeting: meetings },
    loading,
    error
  } = useQuery(GET_MEETING, { variables: { meetingId } });
  if (error) return <div>Error! {error.message}</div>;
  if (loading) return <div>Loading...</div>;
  const meeting = meetings[0];

  const { name, location, start_dtm: startDtm, end_dtm: endDtm } = meeting;

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
}

BasicInfo.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default BasicInfo;
