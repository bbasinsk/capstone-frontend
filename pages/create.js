import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import moment from 'moment';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Header from '../components/header';
import CreateMeeting from '../components/create-meeting';
import Feedback from '../components/footer/feedback';

const { Content, Footer } = Layout;

export default withData(
  withAuth(() => (
    <div>
      <Helmet title="Create Meeting" />
      <div>
        <Layout className="layout" style={{ minHeight: '100vh' }}>
          <Header />

          <Content style={{ padding: '16px' }}>
            <CreateMeeting />
          </Content>

          <Footer style={{ textAlign: 'center' }}>
            NeatMeet ©{moment().year()} | <Feedback />
          </Footer>
        </Layout>
      </div>
    </div>
  ))
);
