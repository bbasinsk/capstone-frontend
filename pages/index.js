import { Helmet } from 'react-helmet';
import App from '../components/App';
import withData from '../libraries/withData';
import { dump } from '../libraries/helpers';
import Share from '../components/ShareJS';

export default withData(props => (
  <App>
    <Helmet>
      <title>Meeting Magic</title>
    </Helmet>
    <div>
      <h1>Meeting Magic</h1>
      <a href="/create">Create</a>
      <hr />
      <Share />
      <pre>{dump(props)}</pre>
    </div>
  </App>
));
