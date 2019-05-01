import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { useSubscription, useMutation } from 'react-apollo-hooks';
import { UPDATE_MEETING, GET_MEETING, SET_WAIT } from '../../../queries';
import Component from './component';
import ShareModal from './share-modal';

const BasicInfoHOC = ({ meetingId, openModal }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const updateMeetingMutation = useMutation(UPDATE_MEETING);
  const setWait = useMutation(SET_WAIT);

  const { data: { meeting: meetings } = {}, loading, error } = useSubscription(
    GET_MEETING,
    {
      variables: { meetingId }
    }
  );

  if (error) return <div>Error! {error.message}</div>;
  if (loading) return <div>Loading...</div>;

  const meeting = meetings[0];

  const { name, location, start_dtm: startDtm, end_dtm: endDtm } = meeting;

  const updateMeeting = async ({
    newName,
    newLocation,
    newStartDtm,
    newEndDtm
  }) => {
    await setWait({ variables: { wait: true } });
    await updateMeetingMutation({
      variables: {
        meetingId,
        name: newName || name,
        location: newLocation || location,
        startDtm: newStartDtm || startDtm,
        endDtm: newEndDtm || endDtm
      }
    });
    return setWait({ variables: { wait: false } });
  };

  return (
    <div>
      <Helmet title={`Meeting: ${name}`} />
      <Component
        name={name}
        updateMeeting={updateMeeting}
        location={location}
        startDtm={startDtm}
        endDtm={endDtm}
        openModal={openModal}
        openShare={() => setShareOpen(true)}
      />
      <ShareModal visible={shareOpen} closeModal={() => setShareOpen(false)} />
    </div>
  );
};

BasicInfoHOC.propTypes = {
  meetingId: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired
};

export default BasicInfoHOC;
