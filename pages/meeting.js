import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import Link from 'next/link';
import { dump } from '../libraries/helpers';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import BasicInfo from '../components/meeting/basic-info';
import Agenda from '../components/meeting/agenda';

const { Content, Footer } = Layout;

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
        <Content>
          <BasicInfo meetingId={props.router.url.query.meetingId} />
          <Agenda meetingId={props.router.url.query.meetingId} />
        </Content>
        <Footer>
          <pre>{dump(props)}</pre>
        </Footer>
      </Layout>
    </div>
  ))
);
