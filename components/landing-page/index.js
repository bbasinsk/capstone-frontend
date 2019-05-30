import React from 'react';
import Banner from './banner';
import Steps from './steps';
import Customers from './customers';
import TryNow from './try-now';
import Footer from '../footer';

const LandingPage = () => (
  <div className="home-page">
    <Banner />
    <Steps />
    <Customers />
    <TryNow />
    <Footer />
  </div>
);

export default LandingPage;
