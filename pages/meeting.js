import { Helmet } from 'react-helmet';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import { dump } from '../libraries/helpers';
import BasicInfo from '../components/Meeting/BasicInfo';
import Agenda from '../components/Meeting/Agenda';
import Members from '../components/Meeting/Members';

export default withData(
  withAuth(props => (
    <div>
      <Helmet>
        <title>meeting</title>
      </Helmet>
      <div>
        <h1>meeting</h1>
        <BasicInfo meetingId={props.router.url.query.meetingId} />
        <Members meetingId={props.router.url.query.meetingId} />
        <Agenda meetingId={props.router.url.query.meetingId} />
        <hr />
        <pre>{dump(props)}</pre>
      </div>
    </div>
  ))
);
