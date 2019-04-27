import React from 'react';
import { Spin } from 'antd';
import { useQuery } from 'react-apollo-hooks';
import { GET_WAIT } from '../../queries';

const Spinner = () => {
  const {
    data: { wait: enableSpinner }
  } = useQuery(GET_WAIT);

  return (
    <div className={`spinner-${enableSpinner ? 'show' : 'hide'}`}>
      <Spin size="large" tip="Loading..." />
      <style jsx>{`
        .spinner-show {
          width: 100vw;
          height: 100vh;
          position: fixed;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgba(0, 0, 0, 0.7);
          opacity: 1;
          transition: opacity 0.1s ease-in;
        }

        .spinner-hide {
          visibility: hidden;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default Spinner;
