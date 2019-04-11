import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';

const GET_MEMBERS = gql`
  query getMeeting($meetingId: uuid!) {
    meeting(where: { meeting_id: { _eq: $meetingId } }) {
      members {
        member {
          id
          name
          email
        }
      }
    }
  }
`;

function Members({ meetingId }) {
  const {
    data: { meeting: meetings },
    loading,
    error
  } = useQuery(GET_MEMBERS, { variables: { meetingId } });
  if (error) return <div>Error! {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  const { members } = meetings[0];

  return (
    <div>
      <h2>Members</h2>
      {members.map(({ member: { name, id } }) => (
        <div key={id}>{name}</div>
      ))}
    </div>
  );
}

Members.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default Members;
