import React from 'react';
import { FEEDBACK_URL } from '../../constants/resources';

export default function Feedback() {
  return (
    <a target="_blank" rel="noopener noreferrer" href={FEEDBACK_URL}>
      Feedback
    </a>
  );
}
