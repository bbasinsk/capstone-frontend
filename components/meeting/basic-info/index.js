import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';
import { useMutation } from 'react-apollo-hooks';
import { UPDATE_MEETING, SET_WAIT } from '../../../queries';
import Component from './component';
import ShareModal from './share-modal';
import { MeetingPropType } from '../../../constants/prop-types/meeting';

const BasicInfoHOC = ({ meeting, openModal }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const updateMeetingMutation = useMutation(UPDATE_MEETING);
  const setWait = useMutation(SET_WAIT);

  const { id, name, location, startDtm, endDtm } = meeting;

  const updateMeeting = async ({
    newName,
    newLocation,
    newStartDtm,
    newEndDtm
  }) => {
    await setWait({ variables: { wait: true } });
    await updateMeetingMutation({
      variables: {
        meetingId: id,
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
  meeting: MeetingPropType.isRequired,
  openModal: PropTypes.func.isRequired
};

export default BasicInfoHOC;
