import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import AgendaItem from '../agenda-item';
import { AgendaItemsPropType } from '../../../constants/prop-types/meeting';

import CreateAgendaItem from '../create-agenda-item';

const { Title } = Typography;

function Agenda({ meetingId, agendaItems }) {
  return (
    <div className="agenda">
      <Title level={2}>Agenda</Title>
      <DragDropContext
        onDragEnd={({ destination, source, draggableId }) => {
          console.log({ destination, source, draggableId });

          if (!destination) {
            return null;
          }
          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          ) {
            return null;
          }
        }}
      >
        <Droppable droppableId="droppable">
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {agendaItems
                .sort((a, b) => a.order - b.order)
                .map(({ id, title, desc, duration, completed }, index) => (
                  <Draggable key={id} draggableId={id} index={index}>
                    {iProvided => (
                      <div
                        className="agenda-item--draggable"
                        {...iProvided.draggableProps}
                        {...iProvided.dragHandleProps}
                        ref={iProvided.innerRef}
                      >
                        <AgendaItem
                          id={id}
                          title={`${index + 1}. ${title}`}
                          desc={desc}
                          duration={duration}
                          completed={completed}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <CreateAgendaItem meetingId={meetingId} />
      <style jsx>{`
        .agenda {
          padding: 24px;
          max-width: 1200px;
          margin: auto;
          margin-bottom: 192px;
        }

        .agenda-item--draggable {
          margin-bottom: 36px;
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
