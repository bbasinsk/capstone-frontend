import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useSubscription } from 'react-apollo-hooks';

const GET_MEETING = gql`
  subscription getMeeting($meetingId: uuid!) {
    meeting(where: { id: { _eq: $meetingId } }) {
      name
      location
      start_dtm
      end_dtm
    }
  }
`;

const BasicInfoHOC = ({ meetingId }) => {
  const { data: { meeting: meetings } = {}, loading, error } = useSubscription(
    GET_MEETING,
    {
      variables: { meetingId }
    }
  );

  if (error) return <div>Error! {error.message}</div>;
  if (loading) return <div>Loading...</div>;
  const meeting = meetings[0];

  const { name, location, start_dtm: startDtm, end_dtm: endDtm } = meeting;

  return (
    <div>
      {name}
      {location}
      {startDtm}
      {endDtm}
    </div>
  );
};

BasicInfoHOC.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default BasicInfoHOC;
