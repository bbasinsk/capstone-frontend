import React, { useState } from 'react';
import { Form, Input, Icon, Button } from 'antd';
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

  const formItems = getFieldValue('keys').map(k => (
    <div key={k}>
      <Form.Item
        validateStatus={getError(`agendaItems[${k}].title`) ? 'error' : ''}
        help={getError(`agendaItems[${k}].title`) || ''}
      >
        {getFieldDecorator(`agendaItems[${k}].title`, {
          rules: [
            {
              required: true,
              message: 'Please input an item title or delete the item.'
            }
          ]
        })(
          <Input
            placeholder="Enter an agenda item title"
            style={{ width: '90%', marginRight: 8 }}
          />
        )}
        {
          <Icon
            className="dynamic-delete-button"
            type="minus-square"
            onClick={() => remove(k)}
          />
        }
      </Form.Item>
      <Form.Item>
        {getFieldDecorator(`agendaItems[${k}].desc`)(
          <TextArea rows={4} placeholder="Enter an agenda item description" />
        )}
      </Form.Item>
    </div>
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
