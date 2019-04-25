import React from 'react';
import Link from 'next/link';
import { Button } from 'antd';

const TryNow = () => (
  <div className="home-layout-wrapper home-try-wrapper">
    <Link href="/create">
      <Button type="primary" size="large">
        Start for free
      </Button>
    </Link>
  </div>
);

export default TryNow;
