import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, Popconfirm, Icon } from 'antd';
import Quill from '../../quill';

const AgendaItem = ({ id, title, desc, deleteAgendaItem }) => {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ marginBottom: '36px' }}>
      <Card
        title={title}
        extra={
          <div>
            <Icon
              type={open ? 'check' : 'down'}
              onClick={() => setOpen(!open)}
              style={{ marginRight: '18px', color: '#1890FF' }}
            />
            <Popconfirm
              placement="topRight"
              icon={<Icon type="warning" />}
              title="Are you sure you want to delete this agenda item?"
              onConfirm={deleteAgendaItem}
              okText="Delete"
              cancelText="Cancel"
            >
              <Icon type="close" style={{ color: '#f5222d' }} />
            </Popconfirm>
          </div>
        }
        bodyStyle={{ display: open ? 'block' : 'none', padding: 0 }}
      >
        <div className="agenda-item__body">
          <div className="agenda-item__desc">
            <h3>{desc && 'Description'}</h3>
            {desc || 'No description'}
          </div>

          <div className="agenda-item__editor">
            <Quill agendaItemId={id} />
          </div>
        </div>
      </Card>

      <style jsx>{`
        .agenda-item__body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: auto;
        }

        .agenda-item__desc {
          padding: 24px;
        }
      `}</style>
    </div>
  );
};
AgendaItem.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string,
  deleteAgendaItem: PropTypes.func.isRequired
};
AgendaItem.defaultProps = {
  desc: ''
};

export default AgendaItem;
