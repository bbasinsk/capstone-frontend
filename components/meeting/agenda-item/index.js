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

const AgendaItem = ({ id, title, desc }) => {
  const deleteAgendaItemMutation = useMutation(DELETE_AGENDA_ITEM);

  const deleteAgendaItem = async () => {
    await deleteAgendaItemMutation({
      variables: { id }
    });
  };

  return (
    <Component
      id={id}
      title={title}
      desc={desc}
      deleteAgendaItem={deleteAgendaItem}
    />
  );
};
AgendaItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string
};
AgendaItem.defaultProps = {
  desc: ''
};

export default AgendaItem;
