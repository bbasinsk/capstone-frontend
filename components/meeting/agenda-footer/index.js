import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

const AgendaFooter = ({ openModal }) => (
  <div className="agenda-footer">
    <div className="agenda-footer--right">
      {/* <div className="agenda-footer__progress">Progress: TODO</div> */}
      <div className="agenda-footer__end">
        <Button onClick={openModal} type="danger">
          END
        </Button>
      </div>
    </div>
    <style>{`
        .agenda-footer {
            position: fixed;
            bottom: -200px;
            background: white;
            width: 100%;
            padding: 32px;
            padding-bottom: 232px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        }

        .agenda-footer--right {
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-items: center;
        }

        .agenda-footer__progress {
            margin-right: 24px;
        }
      `}</style>
  </div>
);
AgendaFooter.propTypes = {
  openModal: PropTypes.func.isRequired
};

export default AgendaFooter;
