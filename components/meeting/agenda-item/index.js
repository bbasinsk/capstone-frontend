import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import Component from './component';
import {
  SET_WAIT,
  DELETE_AGENDA_ITEM,
  SET_ITEM_COMPLETE
} from '../../../queries';

const AgendaItem = ({ id, title, desc, duration, completed }) => {
  const deleteAgendaItem = useMutation(DELETE_AGENDA_ITEM);
  const setCompleted = useMutation(SET_ITEM_COMPLETE);
  const setWait = useMutation(SET_WAIT);

  return (
    <Component
      id={id}
      title={title}
      desc={desc}
      duration={duration}
      deleteAgendaItem={async () => {
        await setWait({ variables: { wait: true } });
        await deleteAgendaItem({
          variables: { id }
        });
        await setWait({ variables: { wait: false } });
      }}
      completed={completed}
      setCompleted={async isCompleted => {
        await setWait({ variables: { wait: true } });
        await setCompleted({
          variables: { id, completed: isCompleted }
        });
        await setWait({ variables: { wait: false } });
      }}
    />
  );
};
AgendaItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  duration: PropTypes.number,
  completed: PropTypes.bool.isRequired
};
AgendaItem.defaultProps = {
  desc: '',
  duration: undefined
};

export default AgendaItem;
