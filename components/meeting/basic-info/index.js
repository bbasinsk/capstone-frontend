import React from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useSubscription } from 'react-apollo-hooks';
import Component from './component';

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

const BasicInfoHOC = ({ meetingId, openModal }) => {
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
      <Helmet title={`Meeting: ${name}`} />
      <Component
        name={name}
        location={location}
        startDtm={startDtm}
        endDtm={endDtm}
        openModal={openModal}
      />
    </div>
  );
};

BasicInfoHOC.propTypes = {
  meetingId: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired
};

export default BasicInfoHOC;
