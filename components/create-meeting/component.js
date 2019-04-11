import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Input,
  Button,
  Checkbox,
  TimePicker,
  DatePicker,
  Row,
  Col
} from 'antd';

const hasErrors = fieldsError =>
  Object.keys(fieldsError).some(field => fieldsError[field]);

const CreateMeeting = ({
  form: {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched,
    validateFields
  },
  createMeeting
}) => {
  const [sendAgenda, setSendAgenda] = useState(true);

  // validate fields when form is mounted
  useEffect(() => {
    validateFields();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        // get the date, start/end times
        const [date] = values.date.toISOString().split('T');
        const [, startTime] = values.startTime.toISOString().split('T');
        const [, endTime] = values.endTime.toISOString().split('T');

        // build the object to create the meeting
        const basicInfo = {
          name: values.name,
          location: values.location,
          startDtm: `${date}T${startTime}`,
          endDtm: `${date}T${endTime}`
        };

        // create the meeting
        createMeeting(basicInfo);
      }
    });
  };

  const getError = field => isFieldTouched(field) && getFieldError(field);

  return (
    <Row>
      <Col xs={24} sm={18} md={12} lg={8} xl={10}>
        <Form onSubmit={handleSubmit}>
          <h1>Create your meeting</h1>
          {/* MEETING NAME */}
          <Form.Item
            validateStatus={getError('name') ? 'error' : ''}
            help={getError('name') || ''}
            label="Meeting Name"
            colon={false}
          >
            {getFieldDecorator('name', {
              rules: [
                { required: true, message: 'Please enter a meeting name' }
              ]
            })(<Input autoFocus placeholder="Enter a meeting name" />)}
          </Form.Item>

          <Form.Item
            label="Time"
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
                  })(
                    <DatePicker style={{ width: '100%' }} placeholder="Date" />
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
                    rules: [
                      { required: true, message: 'Please enter an end time' }
                    ]
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
            label="Location"
            colon={false}
          >
            {getFieldDecorator('location', {
              rules: []
            })(<Input placeholder="Enter a meeting location" />)}
          </Form.Item>
          {/* <h2>Members</h2> */}
          <h2>Agenda</h2>
          <Checkbox
            checked={sendAgenda}
            onChange={e => setSendAgenda(e.target.checked)}
          >
            Send agenda to members
          </Checkbox>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            CREATE
          </Button>
        </Form>
      </Col>
    </Row>
  );
};
CreateMeeting.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func
  }).isRequired,
  createMeeting: PropTypes.func.isRequired
};

const WrappedCreateMeetingForm = Form.create({ name: 'create_meeting' })(
  CreateMeeting
);

export default WrappedCreateMeetingForm;
