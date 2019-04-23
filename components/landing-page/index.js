import React from 'react';
import moment from 'moment';
import { Layout } from 'antd';
import Banner from './banner';
import Header from '../header';
import Page1 from './Page1';
import Page2 from './Page2';

const LandingPage = () => (
  <div className="home-page">
    <Header />
    <Banner />
    <Page1 />
    <Page2 />
    <Layout.Footer style={{ textAlign: 'center' }}>
      NeatMeet ©{moment().year()}
    </Layout.Footer>
  </div>
);

export default LandingPage;
