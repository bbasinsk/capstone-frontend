import React from 'react';
import PropTypes from 'prop-types';
import QueueAnim from 'rc-queue-anim';
import { Button } from 'antd';
import Link from 'next/link';
import BannerImage from './banner-image';
import './static/default.less';
import './static/custom.less';
import './static/home.less';

class Banner extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    className: 'home-banner'
  };

  render() {
    const { className } = this.props;
    return (
      <div className={`home-layout-wrapper ${className}`}>
        <div className="home-layout">
          <QueueAnim
            className={`${className}-content-wrapper`}
            delay={300}
            ease="easeOutQuart"
          >
            <h1 key="h2">Conduct meetings like a CEO</h1>
            <p key="p">
              Collaboratively conduct meetings and quickly compose shareable
              meeting agendas and summaries.
            </p>
            <p key="p2">All for free.</p>
            <span key="button">
              <Link href="/create">
                <Button type="secondary">Start free</Button>
              </Link>
            </span>
          </QueueAnim>
          <div className={`${className}-image-wrapper`}>
            <BannerImage />
          </div>
        </div>
      </div>
    );
  }
}

export default Banner;
