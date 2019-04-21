import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';

const Header = () => (
  <div className="header__wrapper">
    <div className="header">
      <div className="header--left">
        <span className="header__logo">
          <Link href="/">
            <a>[=] NeatMeet</a>
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
        width: 100%;
        max-width: 1200px;
        margin: auto;
      }

      .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 32px 0;
      }

      .header__logo {
        margin-right: 24px;
      }
    `}</style>
  </div>
);

export default Header;
