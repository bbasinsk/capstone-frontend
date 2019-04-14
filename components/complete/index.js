import React from 'react';
import { Button, Icon, Typography } from 'antd';
import { Router, Link } from '../../routes';

const { Text, Title } = Typography;

const Complete = () => {
  const goHome = () => {
    Router.pushRoute('/');
  };

  const goBack = () => {
    Router.back();
  };

  return (
    <div className="complete">
      <Button icon="arrow-left" onClick={goBack}>
        Back to Meeting
      </Button>

      <div className="complete--center">
        <Icon
          type="check-circle"
          theme="twoTone"
          style={{ fontSize: '128px', marginBottom: '16px' }}
        />
        <Title>You&#39;re done!</Title>
        <p>
          <Text type="secondary">Close this tab or create another meeting</Text>
        </p>
        <Button
          type="primary"
          onClick={goHome}
          size="large"
          style={{ marginBottom: '16px' }}
        >
          Home
        </Button>
        <p>
          <Link route="/create">
            <a>Create another meeting</a>
          </Link>
        </p>
      </div>

      <style jsx>{`
        .complete {
          padding: 24px;
        }

        .complete--center {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default Complete;
