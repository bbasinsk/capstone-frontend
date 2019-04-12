import { Helmet } from 'react-helmet';
import { dump } from '../libraries/helpers';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import BasicInfo from '../components/meeting/basic-info';
import Agenda from '../components/meeting/agenda';

export default withData(
  withAuth(props => (
    <div>
      <Helmet>
        <title>meeting</title>
      </Helmet>
      <div>
        <h1>meeting</h1>
        <BasicInfo meetingId={props.router.url.query.meetingId} />
        <Agenda meetingId={props.router.url.query.meetingId} />
        <hr />
        <pre>{dump(props)}</pre>
      </div>
    </div>
  ))
);
