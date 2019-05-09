import React from 'react';
import PropTypes from 'prop-types';
import { Card, Popconfirm, Icon } from 'antd';
import Quill from '../../quill';

const AgendaItem = ({
  id,
  title,
  desc,
  duration,
  deleteAgendaItem,
  collapsed,
  toggleCollapsed,
  dragHandleProps
}) => (
  <div>
    <Card
      title={
        <div {...dragHandleProps} style={{ padding: 8 }}>
          <Icon
            type="pause"
            rotate={90}
            style={{ marginRight: 16, color: 'rgba(0,0,0,0.45)' }}
          />
          {title}
        </div>
      }
      type="inner"
      size="small"
      extra={
        <div>
          {duration && (
            <span className="agenda-item__duration">
              <Icon type="clock-circle" />
              {` ${duration} min`}
            </span>
          )}
          <Icon
            type={collapsed ? 'down' : 'up'}
            onClick={() => toggleCollapsed()}
            style={{ marginRight: 8, color: '#1890FF', padding: 8 }}
          />
          <Popconfirm
            placement="topRight"
            icon={<Icon type="warning" />}
            title="Are you sure you want to delete this agenda item?"
            onConfirm={deleteAgendaItem}
            okText="Delete"
            cancelText="Cancel"
          >
            <Icon type="close" style={{ color: '#f5222d', padding: 8 }} />
          </Popconfirm>
        </div>
      }
      bodyStyle={{ display: collapsed ? 'none' : 'block', padding: 0 }}
    >
      <div className="agenda-item__body">
        <div className="agenda-item__desc">
          <Card.Meta
            title={desc ? 'Description' : 'No Description'}
            description={desc}
          />
        </div>

        <div className="agenda-item__editor">
          <Quill agendaItemId={id} />
        </div>
      </div>
    </Card>

    <style jsx>{`
      .agenda-item__body {
        display: grid;
        grid-template-columns: 1fr 2fr;
        grid-template-rows: auto;
      }

      .agenda-item__desc {
        padding: 24px;
        white-space: pre-line;
      }

      .agenda-item__duration {
        margin-right: 16px;
      }
    `}</style>
  </div>
);
AgendaItem.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  deleteAgendaItem: PropTypes.func.isRequired,
  desc: PropTypes.string,
  dragHandleProps: PropTypes.any.isRequired,
  duration: PropTypes.number,
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  toggleCollapsed: PropTypes.func.isRequired
};
AgendaItem.defaultProps = {
  desc: '',
  duration: null
};

export default AgendaItem;
