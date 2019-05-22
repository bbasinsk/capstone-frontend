import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Meeting from '../components/meeting/meeting';
import Header from '../components/header';
import Spinner from '../components/spinner';
import Footer from '../components/footer';

const { Content } = Layout;

export default withData(
  withAuth(props => (
    <div>
      <Helmet>
        <title>Meeting</title>
      </Helmet>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header background="white" />

        <Content>
          <Meeting
            meetingId={props.router.url.query.meetingId}
            showModal={props.router.url.query.modal}
          />
        </Content>

        <Footer />
        <Spinner />
      </Layout>
    </div>
  ))
);
