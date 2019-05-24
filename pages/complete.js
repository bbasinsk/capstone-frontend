import { Helmet } from 'react-helmet';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Complete from '../components/complete';
import Footer from '../components/footer';

export default withData(
  withAuth(() => (
    <div>
      <Helmet>
        <title>Meeting: Completed</title>
      </Helmet>
      <div style={{ minHeight: '100vh' }}>
        <Complete />
      </div>
      <Footer />
    </div>
  ))
);
