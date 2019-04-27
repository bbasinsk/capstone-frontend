import React from 'react';
import PropTypes from 'prop-types';

const Fill = ({ percentage }) => (
  <div className="fill">
    <style>{`
        .fill {
            width: ${percentage}%;
            background: #4DC8D2;
            height: 100%;
            border-radius: inherit;
            transition: width .2s ease-in;
        }
    `}</style>
  </div>
);
Fill.propTypes = {
  percentage: PropTypes.number.isRequired
};

const ProgressBar = ({ agendaItems }) => {
  const total = agendaItems.length;
  const completed = agendaItems.reduce(
    (complete, item) => complete + !!item.completed,
    0
  );
  const percentage = (100 * completed) / total || 2;

  return (
    <div className="progress">
      <b>
        {completed}/{total} Complete
      </b>
      <div className="progress-bar">
        <Fill percentage={percentage} />
      </div>
      <style>{`
        .progress {
            display: flex;
            flex-direction: row;
            align-items: center;
            
        }
        .progress-bar {
            postition: relative;
            height: 30px;
            width: 200px;
            background: rgb(240, 242, 245);
            box-shadow: 0 0 0 rgba(0, 0, 0, 0.045);
            border-radius: 4px;
            box-sizing: border-box;
            margin-left: 20px;
        }
    `}</style>
    </div>
  );
};

ProgressBar.propTypes = {
  agendaItems: PropTypes.arrayOf(
    PropTypes.shape({ completed: PropTypes.bool.isRequired })
  ).isRequired
};

export default ProgressBar;
