import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import Quill from '../../Quill';

const GET_AGENDA = gql`
  query getMeeting($meetingId: uuid!) {
    meeting(where: { meeting_id: { _eq: $meetingId } }) {
      agenda_items {
        id
        title
        desc
        duration
      }
    }
  }
`;

function Agenda({ meetingId }) {
  const {
    data: { meeting: meetings },
    loading,
    error
  } = useQuery(GET_AGENDA, { variables: { meetingId } });
  if (error) return <div>Error! {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  const { agenda_items: agendaItems } = meetings[0];

  return (
    <div>
      <h2>Agenda</h2>
      {agendaItems.map(({ id, title }) => (
        <div>
          <Quill agendaItemId={id} />
          <ul key={id}>
            <li>{title}</li>
          </ul>
        </div>
      ))}
    </div>
  );
}

Agenda.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default Agenda;
