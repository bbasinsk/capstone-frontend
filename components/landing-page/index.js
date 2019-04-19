import React from 'react';
import Link from 'next/link';

const LandingPage = () => (
  <div>
    <h1>Neat Meet</h1>
    <p>Landing Page</p>
    <Link href="/create">
      <a>Create</a>
    </Link>
  </div>
);

export default LandingPage;
