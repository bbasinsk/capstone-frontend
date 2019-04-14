import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import Link from 'next/link';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Meeting from '../components/meeting/meeting';

export default withData(
  withAuth(props => (
    <div>
      <Helmet>
        <title>Meeting</title>
      </Helmet>
      <Layout>
        <Link href="/">
          <a>Home</a>
        </Link>
        <Meeting meetingId={props.router.url.query.meetingId} />
      </Layout>
    </div>
  ))
);
