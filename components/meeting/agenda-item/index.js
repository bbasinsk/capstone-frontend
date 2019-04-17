import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo-hooks';
import Component from './component';

const DELETE_AGENDA_ITEM = gql`
  mutation deleteItem($id: Int!) {
    delete_agenda_item(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

const SET_ITEM_COMPLETE = gql`
  mutation setItemComplete($id: Int!, $completed: Boolean!) {
    update_agenda_item(
      where: { id: { _eq: $id } }
      _set: { completed: $completed }
    ) {
      affected_rows
    }
  }
`;

const AgendaItem = ({ id, title, desc, duration, completed }) => {
  const deleteAgendaItem = useMutation(DELETE_AGENDA_ITEM);
  const setCompleted = useMutation(SET_ITEM_COMPLETE);

  return (
    <Component
      id={id}
      title={title}
      desc={desc}
      duration={duration}
      deleteAgendaItem={() =>
        deleteAgendaItem({
          variables: { id }
        })
      }
      completed={completed}
      setCompleted={isCompleted =>
        setCompleted({
          variables: { id, completed: isCompleted }
        })
      }
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
