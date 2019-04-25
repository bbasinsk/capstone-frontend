import React from 'react';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Row, Col } from 'antd';
import { customers } from './data';

function getLi(num, d, i) {
  const t = num + 1;
  if (i > t * 4 - 1 || i < num * 4) {
    return null;
  }
  return (
    <Col className="col" span={4} key={i} offset={!(i % 4) ? 1 : 2}>
      <i style={{ backgroundImage: `url(${d})`, backgroundSize: 'contain' }} />
    </Col>
  );
}
export default function Page4() {
  const children = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < Math.floor(customers.length / 4); i++) {
    children.push(
      <QueueAnim component={Row} type="bottom" key={i}>
        {customers.map(getLi.bind(this, i)).filter(item => item)}
      </QueueAnim>
    );
  }

  return (
    <div className="home-layout-wrapper home-user-wrapper">
      <OverPack className="home-layout" playScale={0.4}>
        <QueueAnim
          className="home-user"
          type="bottom"
          key="home-func"
          ease="easeOutQuart"
          leaveReverse
        >
          <h2 key="h2">Trusted by customers</h2>
          <i key="i" className="line" />
          {/* {children} */}
          <QueueAnim
            className="home-user"
            type="bottom"
            key="home-func"
            ease="easeOutQuart"
            leaveReverse
          >
            <div
              style={{
                backgroundImage: `url(${customers[0]})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                width: '160px',
                height: '100px',
                margin: 'auto'
              }}
            >
              {' '}
            </div>
          </QueueAnim>
        </QueueAnim>
      </OverPack>
    </div>
  );
}
