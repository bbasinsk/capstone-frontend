import { Helmet } from 'react-helmet';
import Link from 'next/link';
import App from '../components/App';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import { dump } from '../libraries/helpers';
import Share from '../components/ShareJS';
import Login from '../components/Login';

export default withData(
  withAuth(
    withAuth(props => (
      <App>
        <Helmet>
          <title>Meeting Magic</title>
        </Helmet>
        <div>
          <h1>Meeting Magic</h1>
          <Login />
          <Link href="/create">
            <a>Create</a>
          </Link>
          <hr />
          <Share />
          <pre>{dump(props)}</pre>
        </div>
      </App>
    ))
  )
);
