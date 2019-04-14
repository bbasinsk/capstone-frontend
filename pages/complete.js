import { Helmet } from 'react-helmet';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Complete from '../components/complete';

export default withData(
  withAuth(() => (
    <div>
      <Helmet>
        <title>Meeting: Completed</title>
      </Helmet>
      <div>
        <Complete />
      </div>
    </div>
  ))
);
