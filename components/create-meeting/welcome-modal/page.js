import React from 'react';
import PropTypes from 'prop-types';

const Page = ({ title, desc, imgUrl }) => (
  <div style={{ textAlign: 'center' }}>
    <div
      style={{
        background: '#eeeeee',
        padding: '32px 48px',
        borderRadius: '4px 4px 0 0 '
      }}
    >
      <img src={imgUrl} alt="welcome" style={{ height: 240, margin: 'auto' }} />
    </div>
    <div
      style={{
        padding: '48px 32px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignContent: 'center'
      }}
    >
      <h1>{title}</h1>
      <p>{desc}</p>
    </div>
  </div>
);
Page.propTypes = {
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired
};

export default Page;
