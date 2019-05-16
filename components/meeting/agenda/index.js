import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useMutation } from 'react-apollo-hooks';

import AgendaItem from '../agenda-item';
import CreateAgendaItem from '../create-agenda-item';
import { AgendaItemsPropType } from '../../../constants/prop-types/meeting';
import { UPDATE_AGENDA_ITEM_ORDER } from '../../../queries';
import { width } from '../../../constants/styles';

const { Title } = Typography;

function Agenda({ meetingId, agendaItems, connection }) {
  const updateAgendaItemOrderMutation = useMutation(UPDATE_AGENDA_ITEM_ORDER);

  return (
    <div className="agenda">
      <Title level={2}>Agenda</Title>
      <DragDropContext
        onDragEnd={({ destination, source }) => {
          if (!destination) {
            return null;
          }
          if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
          ) {
            return null;
          }

          const movedItem = agendaItems[source.index];

          const removedMoved = agendaItems.filter(
            (_, idx) => idx !== source.index
          );
          const addedMoved = [
            ...removedMoved.slice(0, destination.index),
            movedItem,
            ...removedMoved.slice(destination.index)
          ];

          const newItemOrdering = addedMoved.map((item, idx) => ({
            ...item,
            order: idx + 1
          }));

          newItemOrdering.forEach(async ({ id, order }) => {
            await updateAgendaItemOrderMutation({ variables: { id, order } });
          });

          // eslint-disable-next-line no-param-reassign
          agendaItems = newItemOrdering;
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
                        ref={iProvided.innerRef}
                      >
                        <AgendaItem
                          id={id}
                          title={`${index + 1}. ${title}`}
                          desc={desc}
                          duration={duration}
                          completed={completed}
                          dragHandleProps={iProvided.dragHandleProps}
                          connection={connection}
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
      <CreateAgendaItem meetingId={meetingId} agendaItems={agendaItems} />
      <style jsx>{`
        .agenda {
          max-width: ${width};
          margin: auto;
          margin-bottom: 64px;
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
  agendaItems: AgendaItemsPropType,
  connection: PropTypes.any.isRequired
};
Agenda.defaultProps = {
  agendaItems: []
};

export default Agenda;
