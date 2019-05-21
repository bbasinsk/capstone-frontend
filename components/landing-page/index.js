import React from 'react';
import moment from 'moment';
import { Layout } from 'antd';
import Banner from './banner';
import Steps from './steps';
import Customers from './customers';
import TryNow from './try-now';

const LandingPage = () => (
  <div className="home-page">
    <Banner />
    <Steps />
    <Customers />
    <TryNow />
    <Layout.Footer style={{ textAlign: 'center' }}>
      <p>NeatMeet ©{moment().year()}</p>
      <p>
        <a href="/terms" alt="Link to terms and conditions">
          Terms and Conditions
        </a>
        {' | '}
        <a href="/privacy" alt="Link to terms and conditions">
          Privacy Policy
        </a>
      </p>
    </Layout.Footer>
  </div>
);

export default LandingPage;
