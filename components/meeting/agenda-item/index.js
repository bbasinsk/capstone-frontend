import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import Component from './component';
// import { SET_ITEM_COMPLETE } from '../../../queries';
import { DELETE_AGENDA_ITEM, SET_WAIT } from '../../../queries';

const AgendaItem = ({
  id,
  title,
  desc,
  duration,
  dragHandleProps,
  connection
}) => {
  const setWait = useMutation(SET_WAIT);
  const deleteAgendaItem = useMutation(DELETE_AGENDA_ITEM);
  // const setCompleted = useMutation(SET_ITEM_COMPLETE);
  const [collapsed, setCollapsed] = useState(false);

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
      dragHandleProps={dragHandleProps}
      collapsed={collapsed}
      toggleCollapsed={() => setCollapsed(!collapsed)}
      connection={connection}
    />
  );
};
AgendaItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  duration: PropTypes.number,
  completed: PropTypes.bool.isRequired,
  dragHandleProps: PropTypes.any.isRequired,
  connection: PropTypes.any.isRequired
};
AgendaItem.defaultProps = {
  desc: '',
  duration: undefined
};

export default AgendaItem;
