import { Helmet } from 'react-helmet';
import { Layout } from 'antd';
import withData from '../libraries/withData';
import withAuth from '../libraries/withAuth';
import Header from '../components/header';
import CreateMeeting from '../components/create-meeting';
import Footer from '../components/footer';
import Spinner from '../components/spinner';

const { Content } = Layout;

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

          <Footer />
          <Spinner />
        </Layout>
      </div>
    </div>
  ))
);
