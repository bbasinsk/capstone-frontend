import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import AgendaItem from './agenda-item';

const GET_AGENDA = gql`
  query getMeeting($meetingId: uuid!) {
    meeting(where: { id: { _eq: $meetingId } }) {
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
      {agendaItems.map(({ id, title, desc }, index) => (
        <div key={id}>
          <AgendaItem id={id} title={`${index + 1}. ${title}`} desc={desc} />
        </div>
      ))}
    </div>
  );
}

Agenda.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default Agenda;
