import React, { useState } from 'react';
import { Form, Input, Icon, Button, Card } from 'antd';
import PropTypes from 'prop-types';

const { TextArea } = Input;

const AgendaItems = ({
  getFieldDecorator,
  getFieldValue,
  setFieldsValue,
  validateFields,
  getError
}) => {
  const [nextId, setNextId] = useState(0);

  const add = async () => {
    const keys = getFieldValue('keys');

    setNextId(nextId + 1);
    const nextKeys = keys.concat(nextId);
    await setFieldsValue({ keys: nextKeys });

    validateFields();
  };

  const remove = k => {
    const keys = getFieldValue('keys');
    setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  };

  getFieldDecorator('keys', { initialValue: [] });

  const formItems = getFieldValue('keys').map((k, idx) => (
    <Card
      key={k}
      type="inner"
      className="agenda-item"
      title={
        <div className="agenda-item__top">
          <div className="agenda-item__top__title">
            <Form.Item
              validateStatus={
                getError(`agendaItems[${k}].title`) ? 'error' : ''
              }
              help={getError(`agendaItems[${k}].title`) || ''}
            >
              {getFieldDecorator(`agendaItems[${k}].title`, {
                rules: [
                  {
                    required: true,
                    message: 'Please input a title or delete the item.'
                  }
                ]
              })(
                <div>
                  <span style={{ marginRight: 12 }}>{`${idx + 1}.`}</span>
                  <Input placeholder="Enter a title" />
                </div>
              )}
            </Form.Item>
          </div>
          <div>
            <Icon
              className="dynamic-delete-button"
              type="close"
              onClick={() => remove(k)}
            />
          </div>
        </div>
      }
    >
      <Form.Item>
        {getFieldDecorator(`agendaItems[${k}].desc`)(
          <TextArea rows={4} placeholder="Enter a description" />
        )}
      </Form.Item>
    </Card>
  ));

  return (
    <div>
      {formItems}
      <Form.Item>
        <Button
          type="dashed"
          onClick={add}
          style={{ width: '100%', height: '100px' }}
        >
          <Icon type="plus" /> Add Agenda Item
        </Button>
      </Form.Item>
      <style jsx global>{`
        .agenda-item {
          margin-bottom: 32px;
        }

        .agenda-item__top {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        .agenda-item__top__title .ant-form-item {
          margin-bottom: 0;
        }
      `}</style>
    </div>
  );
};

AgendaItems.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  setFieldsValue: PropTypes.func.isRequired,
  validateFields: PropTypes.func.isRequired,
  getError: PropTypes.func.isRequired
};

export default AgendaItems;
