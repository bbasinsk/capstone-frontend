import { Helmet } from 'react-helmet';
import App from '../components/App';
import withData from '../libraries/withData';
import { dump } from '../libraries/helpers';
import BasicInfo from '../components/Meeting/BasicInfo';
import Agenda from '../components/Meeting/Agenda';
import Members from '../components/Meeting/Members';

export default withData(({ router }) => (
  <App>
    <Helmet>
      <title>meeting</title>
    </Helmet>
    <div>
      <h1>meeting</h1>
      <BasicInfo meetingId={router.url.query.meetingId} />
      <Members meetingId={router.url.query.meetingId} />
      <Agenda meetingId={router.url.query.meetingId} />
      <hr />
      <pre>{dump(router)}</pre>
    </div>
  </App>
));
