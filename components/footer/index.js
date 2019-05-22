import React from 'react';
import moment from 'moment';
import { Layout } from 'antd';

const Footer = () => (
  <Layout.Footer
    style={{
      textAlign: 'center'
    }}
  >
    <p>NeatMeet ©{moment().year()}</p>
    <p>
      <a href="/terms" alt="Link to terms and conditions">
        Terms and Conditions
      </a>
      {' | '}
      <a href="/privacy" alt="Link to privacy policy">
        Privacy Policy
      </a>
      {' | '}
      <a href="/about" alt="Link to about us page">
        About Us
      </a>
    </p>
  </Layout.Footer>
);

export default Footer;
