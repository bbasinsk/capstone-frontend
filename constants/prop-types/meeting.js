/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';

export const MeetingPropType = PropTypes.shape({
  name: PropTypes.string.isRequired,
  location: PropTypes.string,
  startDtm: PropTypes.string,
  endDtm: PropTypes.string,
  emails: PropTypes.arrayOf(PropTypes.string),
  agendaItems: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      desc: PropTypes.string
    })
  )
});
