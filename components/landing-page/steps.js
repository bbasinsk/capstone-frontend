import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import OverPack from 'rc-scroll-anim/lib/ScrollOverPack';
import { Row, Col } from 'antd';
import { steps } from './data';

const Column = ({ children }) => (
  <Col lg={8} style={{ marginBottom: 48 }}>
    {children}
  </Col>
);
Column.propTypes = {
  children: PropTypes.any.isRequired
};

export default function Page1() {
  const children = steps.map((d, i) => (
    <QueueAnim
      // eslint-disable-next-line react/no-array-index-key
      key={i}
      component={Column}
      type="bottom"
      className="col"
      componentProps={{ span: 8 }}
    >
      <div style={{ padding: 16 }}>
        <div
          key="image"
          className="image"
          style={{
            backgroundImage: `url(${d.src})`,
            backgroundSize: 'contain'
          }}
        />
        <h3 key="h3">{d.title}</h3>
        <p key="p">{d.content}</p>
      </div>
    </QueueAnim>
  ));

  return (
    <div className="home-layout-wrapper home-func-wrapper" id="home-func">
      <h2>How it works</h2>
      <i className="line" />
      <OverPack className="home-layout" location="home-func" playScale={0.4}>
        <QueueAnim
          className="home-func"
          type="bottom"
          key="home-func"
          ease="easeOutQuart"
          leaveReverse
        >
          <QueueAnim
            key="content"
            component={Row}
            type="bottom"
            componentProps={{ gutter: 171 }}
          >
            {children}
          </QueueAnim>
        </QueueAnim>
      </OverPack>
    </div>
  );
}
