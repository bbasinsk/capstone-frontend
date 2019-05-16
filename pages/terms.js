import { Helmet } from 'react-helmet';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Header from '../components/header';

export default withData(
  withAuth(() => (
    <div>
      <Helmet>
        <title>Terms of Service</title>
      </Helmet>
      <Header />
      <div>
        <h1> Terms of Service </h1>

        <h2> Changes to This Terms and Conditions</h2>

        <h2> Contact Us </h2>
      </div>
      <style jsx>{`
        h1 {
          color: #2a313e;
          font-size: 32px;
        }

        body {
          font-family: 'Work Sans', sans-serif;
        }
      `}</style>
    </div>
  ))
);
