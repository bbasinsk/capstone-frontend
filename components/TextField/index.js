import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Subscription, Mutation } from 'react-apollo';
import { useState } from 'react';

const GET_TEXT = gql`
  subscription {
    meeting {
      text_field
    }
  }
`;

const UPDATE_TEXT = gql`
  mutation updateMeeting($id: Int, $text: String) {
    update_meeting(where: { id: { _eq: $id } }, _set: { text_field: $text }) {
      affected_rows
      returning {
        id
        text_field
      }
    }
  }
`;

const TextField = ({ initialValue }) => {
  const [state, setState] = useState(initialValue);
  return (
    <div>
      <h2>Realtime Textbox</h2>
      <div>Value: {initialValue}</div>
      <Mutation mutation={UPDATE_TEXT}>
        {updateText => (
          <textarea
            onChange={e => {
              const { value } = e.target;
              setState(value);
              updateText({ variables: { text: value, id: 1 } });
            }}
            value={state}
          />
        )}
      </Mutation>
    </div>
  );
};
TextField.propTypes = {
  initialValue: PropTypes.string.isRequired
};

export default () => (
  <div>
    <Subscription subscription={GET_TEXT}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        return <TextField initialValue={data.meeting[0].text_field} />;
      }}
    </Subscription>
  </div>
);
