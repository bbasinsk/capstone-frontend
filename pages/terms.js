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
      <div className="container">
        <div className="inner-element">
          <h1> Terms of Service </h1>

          <h2> Changes to This Terms and Conditions</h2>

          <h2> Contact Us </h2>
        </div>
      </div>
      <style jsx>{`
        h1 {
          color: #2a313e;
          font-size: 32px;
        }

        body {
          height: 100vh;
          display: flex;
          font-family: 'Work Sans', sans-serif;
        }

        container {
          position: relative;
        }

        .inner-element {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          margin: auto;
          width: 50vw;
          height: 70vh;
        }
      `}</style>
    </div>
  ))
);
