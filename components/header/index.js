import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Button } from 'antd';
import { width } from '../../constants/styles';

const Header = ({ background }) => (
  <div className="header__wrapper">
    <div className="header">
      <div className="header--left">
        <span className="header__logo">
          <Link href="/">
            <a>
              <img
                src="/static/logo/logo_color.svg"
                alt="NeatMeet"
                style={{ width: '120px', cursor: 'pointer' }}
              />
            </a>
          </Link>
        </span>
      </div>

      <div className="header--right">
        <Link href="/">
          <a style={{ marginRight: '32px' }}>Home</a>
        </Link>

        <Link href="/create">
          <Button type="primary">Create Meeting</Button>
        </Link>
      </div>
    </div>
    <style jsx>{`
      .header__wrapper {
        background: ${background};
        width: 100%;
      }

      .header {
        max-width: ${width};
        margin: auto;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 32px 24px;
      }

      .header__logo {
        margin-right: 24px;
      }
    `}</style>
  </div>
);
Header.propTypes = {
  background: PropTypes.string
};
Header.defaultProps = {
  background: 'none'
};

export default Header;
