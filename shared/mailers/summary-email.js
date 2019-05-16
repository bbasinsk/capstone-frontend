import React from 'react';
import PropTypes from 'prop-types';
import { Item, Span, Email, Box, A } from 'react-html-email';

const SummaryEmail = ({ meeting, isPreview }) => {
  const EmailContainer = isPreview
    ? // eslint-disable-next-line react/prop-types
      ({ children }) => (
        <div
          style={{
            padding: '24px',
            width: 600,
            boxShadow: '0 0 0 rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(0, 0, 0, 0.2)'
          }}
        >
          <table style={{ width: '100%' }}>
            <tbody>{children}</tbody>
          </table>
        </div>
      )
    : // eslint-disable-next-line react/prop-types
      ({ children }) => (
        <Email title={`Meeting Summary: ${meeting.name}`}>{children}</Email>
      );

  return (
    <div className="email__outer-wrapper">
      <EmailContainer>
        <Item style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.2)' }}>
          <Box>
            <Item align="left">
              <Box height="50px">
                <Item>
                  <Span fontSize={24}>Meeting Summary: {meeting.name}</Span>
                </Item>
              </Box>
            </Item>
            <Item align="left">
              <Span>{meeting.date}</Span>
            </Item>
            <Item align="left">
              <Span>{meeting.time}</Span>
            </Item>
            <Item align="left" style={{ paddingBottom: 16 }}>
              <Span>Location: {meeting.location || 'Not Set'}</Span>
            </Item>
          </Box>
        </Item>

        <Item style={{ paddingTop: 16 }}>
          <Span fontSize={18} lineHeight={40}>
            Agenda Items
          </Span>
        </Item>
        {meeting.agendaItems.length ? (
          meeting.agendaItems.map((item, idx) => {
            const { Notes } = item;
            return (
              // eslint-disable-next-line react/no-array-index-key
              <Item key={idx}>
                <Box cellPadding={4}>
                  <Item>
                    <Span fontSize={14} fontWeight="bold">
                      {idx + 1}. {item.title}
                    </Span>
                  </Item>
                  <Item>
                    <div style={{ whiteSpace: 'pre-line' }}>{item.desc}</div>
                  </Item>
                  <Item>{Notes}</Item>
                </Box>
              </Item>
            );
          })
        ) : (
          <Item>
            <Span style={{ color: '#777' }}>No Agenda Items</Span>
          </Item>
        )}

        {!isPreview && (
          <Item align="center">
            <A href={`https://www.neatmeet.co/meeting/${meeting.id}`}>
              View this meeting on NeatMeet
            </A>
          </Item>
        )}
      </EmailContainer>
    </div>
  );
};
SummaryEmail.propTypes = {
  meeting: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    agendaItems: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        desc: PropTypes.string,
        Notes: PropTypes.element
      })
    )
  }).isRequired,
  isPreview: PropTypes.bool
};
SummaryEmail.defaultProps = {
  isPreview: false
};

export default SummaryEmail;
