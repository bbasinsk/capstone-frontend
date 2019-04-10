import { Helmet } from 'react-helmet';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import CreateMeeting from '../components/create-meeting';

export default withData(
  withAuth(() => (
    <div>
      <Helmet>
        <title>Create a meeting</title>
      </Helmet>
      <div>
        <a href="/">Home</a>
        <CreateMeeting />
      </div>
    </div>
  ))
);
