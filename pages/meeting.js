import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import moment from 'moment';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Meeting from '../components/meeting/meeting';
import Header from '../components/header';
import Spinner from '../components/spinner';

const { Content, Footer } = Layout;

export default withData(
  withAuth(props => (
    <div>
      <Helmet>
        <title>Meeting</title>
      </Helmet>
      <Layout className="layout" style={{ minHeight: '100vh' }}>
        <Header background="white" />

        <Content>
          <Meeting meetingId={props.router.url.query.meetingId} />
        </Content>

        <Footer
          style={{
            textAlign: 'center'
            //  marginBottom: '40px'
          }}
        >
          <p>NeatMeet ©{moment().year()}</p>
          <a href="/terms" alt="Link to terms and conditions">
            Terms and Conditions{' '}
          </a>
        </Footer>
        <Spinner />
      </Layout>
    </div>
  ))
);
