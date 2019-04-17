import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useSubscription } from 'react-apollo-hooks';
import { Typography } from 'antd';
import AgendaItem from '../agenda-item';

import CreateAgendaItem from '../create-agenda-item';

const { Title } = Typography;

const GET_AGENDA = gql`
  subscription getMeeting($meetingId: uuid!) {
    meeting(where: { id: { _eq: $meetingId } }) {
      agenda_items {
        id
        title
        desc
        duration
        completed
      }
    }
  }
`;

function Agenda({ meetingId }) {
  const { data: { meeting: meetings } = {}, loading, error } = useSubscription(
    GET_AGENDA,
    {
      variables: { meetingId }
    }
  );
  if (error) return <div>Error! {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  const { agenda_items: agendaItems } = meetings[0];

  return (
    <div className="agenda">
      <Title level={2}>Agenda</Title>
      {agendaItems
        .sort(({ id: idA }, { id: idB }) => idB - idA)
        .map(({ id, title, desc, duration, completed }, index) => (
          <div key={id}>
            <AgendaItem
              id={id}
              title={`${index + 1}. ${title}`}
              desc={desc}
              duration={duration}
              completed={completed}
            />
          </div>
        ))}
      <CreateAgendaItem meetingId={meetingId} />
      <style jsx>{`
        .agenda {
          padding: 24px;
          max-width: 1200px;
          margin: auto;
          margin-bottom: 192px;
        }
      `}</style>
    </div>
  );
}

Agenda.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default Agenda;
