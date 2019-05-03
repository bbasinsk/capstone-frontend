import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import AgendaItem from '../agenda-item';
import { AgendaItemsPropType } from '../../../constants/prop-types/meeting';

import CreateAgendaItem from '../create-agenda-item';

const { Title } = Typography;

function Agenda({ meetingId, agendaItems }) {
  return (
    <div className="agenda">
      <Title level={2}>Agenda</Title>
      {agendaItems
        .sort((a, b) => a.order - b.order)
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
      <CreateAgendaItem meetingId={meetingId} agendaItems={agendaItems} />
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
  meetingId: PropTypes.string.isRequired,
  agendaItems: AgendaItemsPropType
};
Agenda.defaultProps = {
  agendaItems: []
};

export default Agenda;
