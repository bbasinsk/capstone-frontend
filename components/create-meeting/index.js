import React from 'react';
import { useMutation } from 'react-apollo-hooks';
import gql from 'graphql-tag';
import Component from './component';

const CREATE_MEETING = gql`
  mutation createMeeting(
    $name: String
    $location: String
    $startDtm: timestamptz
    $endDtm: timestamptz
  ) {
    insert_meeting(
      objects: [
        {
          name: $name
          location: $location
          start_dtm: $startDtm
          end_dtm: $endDtm
        }
      ]
    ) {
      returning {
        id
      }
    }
  }
`;

export default function hoc() {
  const createMeeting = ({ name, location, startDtm, endDtm }) =>
    useMutation(CREATE_MEETING)({
      variables: {
        name,
        location,
        startDtm,
        endDtm
      }
    });

  return (
    <div>
      <Component createMeeting={createMeeting} />
    </div>
  );
}
