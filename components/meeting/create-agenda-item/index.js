import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Component from './component';

const CREATE_AGENDA_ITEM = gql`
  mutation createAgenda($meetingId: uuid!, $title: String!, $desc: String) {
    insert_agenda_item(
      objects: [{ meeting_id: $meetingId, title: $title, desc: $desc }]
    ) {
      returning {
        id
      }
    }
  }
`;

const CreateAgendaItem = ({ meetingId }) => {
  const createAgendaItemMutation = useMutation(CREATE_AGENDA_ITEM);

  const createAgendaItem = async ({ title, desc }) => {
    // create item in db
    await createAgendaItemMutation({
      variables: { meetingId, title, desc }
    });
  };

  return (
    <div>
      <Component createAgendaItem={createAgendaItem} />
    </div>
  );
};
CreateAgendaItem.propTypes = {
  meetingId: PropTypes.string.isRequired
};

export default CreateAgendaItem;
