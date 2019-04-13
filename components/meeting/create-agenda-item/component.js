import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Row, Col, Card } from 'antd';

const { TextArea } = Input;

const hasErrors = fieldsError =>
  Object.keys(fieldsError).some(field => fieldsError[field]);

const CreateAgendaItem = ({
  form: {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    isFieldTouched,
    validateFields,
    resetFields
  },
  createAgendaItem
}) => {
  const [open, setOpen] = useState(false);

  // validate fields when form is mounted
  useEffect(() => {
    validateFields();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    validateFields((err, values) => {
      if (!err) {
        const { title, desc } = values;
        createAgendaItem({ title, desc }).then(() => {
          resetFields();
          setOpen(false);
        });
      }
    });
  };

  const getError = field => isFieldTouched(field) && getFieldError(field);

  return !open ? (
    <div style={{ textAlign: 'center' }}>
      <Button size="large" type="primary" onClick={() => setOpen(true)}>
        NEW
      </Button>
    </div>
  ) : (
    <Card>
      <Row>
        <Col xs={24} sm={18} md={12} lg={8} xl={10}>
          <Form onSubmit={handleSubmit}>
            <h1>New agenda item</h1>

            {/* TITLE */}
            <Form.Item
              validateStatus={getError('title') ? 'error' : ''}
              help={getError('title') || ''}
              label="What is the name of the agenda item?"
              colon={false}
            >
              {getFieldDecorator('title', {
                rules: [
                  { required: true, message: 'Please enter an item name' }
                ]
              })(<Input autoFocus placeholder="Enter an item name" />)}
            </Form.Item>

            {/* DESCRIPTION */}
            <Form.Item
              validateStatus={getError('desc') ? 'error' : ''}
              help={getError('desc') || ''}
              label="Describe the agenda item"
              colon={false}
            >
              {getFieldDecorator('desc', {
                rules: []
              })(<TextArea rows={4} placeholder="Enter a description" />)}
            </Form.Item>

            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              disabled={hasErrors(getFieldsError())}
            >
              Create
            </Button>
          </Form>
        </Col>
      </Row>
    </Card>
  );
};
CreateAgendaItem.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func
  }).isRequired,
  createAgendaItem: PropTypes.func.isRequired
};

const WrappedCreateAgendaItemForm = Form.create({ name: 'create_agenda_item' })(
  CreateAgendaItem
);

export default WrappedCreateAgendaItemForm;
