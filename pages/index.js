import { Helmet } from 'react-helmet';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import LandingPage from '../components/landing-page';

export default withData(
  withAuth(() => (
    <div>
      <Helmet>
        <title>NeatMeet</title>
      </Helmet>
      <div>
        <LandingPage />
      </div>
    </div>
  ))
);
