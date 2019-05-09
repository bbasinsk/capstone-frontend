import React from 'react';
import moment from 'moment';
import { Layout } from 'antd';
import Banner from './banner';
import Steps from './steps';
import Customers from './customers';
import TryNow from './try-now';
import Feedback from '../footer/feedback';

const LandingPage = () => (
  <div className="home-page">
    <Banner />
    <Steps />
    <Customers />
    <TryNow />
    <Layout.Footer style={{ textAlign: 'center' }}>
      NeatMeet ©{moment().year()} | <Feedback />
    </Layout.Footer>
  </div>
);

export default LandingPage;
