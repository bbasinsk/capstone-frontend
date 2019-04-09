import { Helmet } from 'react-helmet';
import Link from 'next/link';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import { dump } from '../libraries/helpers';
import Login from '../components/Login';

export default withData(
  withAuth(props => (
    <div>
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
        <pre>{dump(props)}</pre>
      </div>
    </div>
  ))
);
