import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, TimePicker, DatePicker, Row, Col } from 'antd';
import moment from 'moment';

const BasicInfo = ({ getError, getFieldDecorator, getFieldValue }) => {
  const invalidDate = () => {
    const date = getFieldValue('date');
    const startTime = getFieldValue('startTime');

    if (!date || !startTime) {
      return;
    }

    const day = date.format().split('T')[0];
    const time = startTime.format().split('T')[1];

    const start = day && time && moment(`${day}T${time}`);
    const now = moment();

    if (start.endOf('minute') < now) {
      return 'Time must not be in the past';
    }
  };

  const invalidTime = () => {
    const start = getFieldValue('startTime');
    const end = getFieldValue('endTime');

    if (start > end) {
      return 'End time must be after start';
    }
  };

  return (
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
              validateStatus={getError('date') || invalidDate() ? 'error' : ''}
              help={getError('date') || invalidDate() || ''}
            >
              {getFieldDecorator('date', {
                rules: [{ required: true, message: 'Please enter a date' }]
              })(
                <DatePicker
                  style={{ width: '100%' }}
                  placeholder="Date"
                  disabledDate={current =>
                    current && current < moment().startOf('day')
                  }
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            {/* START-TIME */}
            <Form.Item
              validateStatus={getError('startTime') ? 'error' : ''}
              help={getError('startTime') || ''}
            >
              {getFieldDecorator('startTime', {
                rules: [
                  { required: true, message: 'Please enter a start time' }
                ]
              })(
                <TimePicker
                  style={{ width: '100%' }}
                  use12Hours
                  format="h:mm a"
                  minuteStep={5}
                  placeholder="Start time"
                  defaultOpenValue={moment('09:00', 'HH:mm')}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={8}>
            {/* END-TIME */}
            <Form.Item
              validateStatus={
                getError('endTime') || invalidTime() ? 'error' : ''
              }
              help={getError('endTime') || invalidTime() || ''}
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
                  defaultOpenValue={moment('10:00', 'HH:mm')}
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
        })(<Input placeholder="Enter a meeting location (optional)" />)}
      </Form.Item>
    </div>
  );
};

BasicInfo.propTypes = {
  getError: PropTypes.func.isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired
};

export default BasicInfo;
