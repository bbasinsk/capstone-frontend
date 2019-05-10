import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'antd';

const Email = ({ getFieldDecorator, getError }) => {
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 }
    }
  };

  return (
    <div>
      <Form.Item
        {...formItemLayout}
        required
        validateStatus={getError('email') ? 'error' : ''}
        help={getError('email') || ''}
      >
        {getFieldDecorator(`email`, {
          validateTrigger: ['onChange', 'onBlur'],
          rules: [
            {
              type: 'email',
              message: 'Please enter a valid email'
            },
            {
              required: true,
              message: 'Please enter your email'
            }
          ]
        })(
          <Input
            placeholder="Your email"
            style={{ width: '50%', marginRight: 8 }}
          />
        )}
      </Form.Item>
    </div>
  );
};
Email.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  getError: PropTypes.func.isRequired
};

export default Email;
