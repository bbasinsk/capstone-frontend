import { Helmet } from 'react-helmet';
import App from '../components/App';
import withData from '../libraries/withData';
import { dump } from '../libraries/helpers';

export default withData(props => (
  <App>
    <Helmet>
      <title>Create a meeting</title>
    </Helmet>
    <div>
      <a href="/">Home</a>
      <h1>Create a meeting</h1>
      <div>Form to create a meeting</div>
      <div>Add members</div>
      <div>Create Agenda</div>
      <button type="button">Submit</button>
      <hr />
      <pre>{dump(props)}</pre>
    </div>
  </App>
));
