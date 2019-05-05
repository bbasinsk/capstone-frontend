import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import Component from './component';
import { CREATE_AGENDA_ITEM, SET_WAIT } from '../../../queries';
import { AgendaItemsPropType } from '../../../constants/prop-types/meeting';

const CreateAgendaItem = ({ meetingId, agendaItems }) => {
  const createAgendaItemMutation = useMutation(CREATE_AGENDA_ITEM);
  const setWait = useMutation(SET_WAIT);

  const createAgendaItem = async ({ title, desc }) => {
    await setWait({ variables: { wait: true } });
    // create item in db
    await createAgendaItemMutation({
      variables: { meetingId, title, desc, order: agendaItems.length + 1 }
    });
    await setWait({ variables: { wait: false } });
  };

  return (
    <div>
      <Component createAgendaItem={createAgendaItem} />
    </div>
  );
};
CreateAgendaItem.propTypes = {
  meetingId: PropTypes.string.isRequired,
  agendaItems: AgendaItemsPropType
};
CreateAgendaItem.defaultProps = {
  agendaItems: []
};

export default CreateAgendaItem;
