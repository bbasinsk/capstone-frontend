import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, TimePicker, DatePicker, Row, Col } from 'antd';

const BasicInfo = ({ getError, getFieldDecorator }) => (
  <div>
    {/* MEETING NAME */}
    <Form.Item
      validateStatus={getError('name') ? 'error' : ''}
      help={getError('name') || ''}
      label="What is your meeting for?"
      colon={false}
    >
      {getFieldDecorator('name', {
        rules: [{ required: true, message: 'Please enter a meeting name' }]
      })(<Input autoFocus placeholder="Enter a meeting name" />)}
    </Form.Item>
    <Form.Item
      label="When do you want to meet?"
      required
      colon={false}
      style={{ marginBottom: 0 }}
    >
      <Row gutter={8}>
        <Col span={8}>
          {/* DATE */}
          <Form.Item
            validateStatus={getError('date') ? 'error' : ''}
            help={getError('date') || ''}
          >
            {getFieldDecorator('date', {
              rules: [{ required: true, message: 'Please enter a date' }]
            })(<DatePicker style={{ width: '100%' }} placeholder="Date" />)}
          </Form.Item>
        </Col>
        <Col span={8}>
          {/* START-TIME */}
          <Form.Item
            validateStatus={getError('startTime') ? 'error' : ''}
            help={getError('startTime') || ''}
          >
            {getFieldDecorator('startTime', {
              rules: [{ required: true, message: 'Please enter a start time' }]
            })(
              <TimePicker
                style={{ width: '100%' }}
                use12Hours
                format="h:mm a"
                minuteStep={5}
                placeholder="Start time"
              />
            )}
          </Form.Item>
        </Col>
        <Col span={8}>
          {/* END-TIME */}
          <Form.Item
            validateStatus={getError('endTime') ? 'error' : ''}
            help={getError('endTime') || ''}
          >
            {getFieldDecorator('endTime', {
              rules: [{ required: true, message: 'Please enter an end time' }]
            })(
              <TimePicker
                style={{ width: '100%' }}
                use12Hours
                format="h:mm a"
                minuteStep={5}
                placeholder="End time"
              />
            )}
          </Form.Item>
        </Col>
      </Row>
    </Form.Item>
    {/* LOCATION */}
    <Form.Item
      validateStatus={getError('location') ? 'error' : ''}
      help={getError('location') || ''}
      label="Where are you meeting?"
      colon={false}
    >
      {getFieldDecorator('location', {
        rules: []
      })(<Input placeholder="Enter a meeting location" />)}
    </Form.Item>
  </div>
);

BasicInfo.propTypes = {
  getError: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired
};

export default BasicInfo;
