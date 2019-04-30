import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Card, Typography } from 'antd';
import lodash from 'lodash';
import BasicInfo from './basic-info';
import AgendaItems from './agenda-items';
import Members from './members';

const { Title } = Typography;

const formHasErrors = (fieldsError, agendaKeys, memberKeys) => {
  const withoutAgenda = lodash.omit(fieldsError, ['agendaItems', 'members']);

  const agendaErrors = (fieldsError.agendaItems || [])
    .filter((item, idx) => agendaKeys.includes(idx))
    .map(item => Object.keys(item).some(field => item[field]))
    .some(item => item);

  const memberErrors = (fieldsError.members || [])
    .filter((item, idx) => memberKeys.includes(idx))
    .some(item => item);

  const infoErrors = Object.keys(withoutAgenda).some(
    field => fieldsError[field]
  );

  return infoErrors || agendaErrors || memberErrors;
};

const CreateMeeting = ({
  form: {
    getFieldDecorator,
    getFieldsError,
    getFieldError,
    getFieldValue,
    setFieldsValue,
    isFieldTouched,
    validateFields
  },
  createMeeting
}) => {
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
        const agendaItems = getFieldValue('agendaKeys').map(
          k => values.agendaItems[k]
        );
        const emails = getFieldValue('memberKeys').map(k => values.members[k]);

        // build the object to create the meeting
        const meeting = {
          name: values.name,
          location: values.location,
          startDtm: `${date}T${startTime}`,
          endDtm: `${date}T${endTime}`,
          emails,
          agendaItems
        };

        // create the meeting
        createMeeting(meeting);
      }
    });
  };

  const getError = field => isFieldTouched(field) && getFieldError(field);

  return (
    <div>
      <Title>Create your meeting</Title>
      <Card>
        <Row>
          <Col xs={24} sm={24} md={18} lg={16} xl={14}>
            <Form onSubmit={handleSubmit}>
              <BasicInfo
                getFieldDecorator={getFieldDecorator}
                getError={getError}
              />

              <Title level={2}>Members</Title>
              <Members
                getFieldDecorator={getFieldDecorator}
                getFieldValue={getFieldValue}
                setFieldsValue={setFieldsValue}
              />

              <Title level={2}>Agenda</Title>
              <AgendaItems
                getFieldDecorator={getFieldDecorator}
                getFieldValue={getFieldValue}
                setFieldsValue={setFieldsValue}
                validateFields={validateFields}
                getError={getError}
              />

              {/* <Checkbox
            checked={sendAgenda}
            onChange={e => setSendAgenda(e.target.checked)}
          >
            Send agenda to members
          </Checkbox> */}

              <Button
                type="primary"
                htmlType="submit"
                disabled={formHasErrors(
                  getFieldsError(),
                  getFieldValue('agendaKeys'),
                  getFieldValue('memberKeys')
                )}
              >
                CREATE
              </Button>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};
CreateMeeting.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func.isRequired,
    getFieldValue: PropTypes.func.isRequired,
    setFieldsValue: PropTypes.func.isRequired
  }).isRequired,
  createMeeting: PropTypes.func.isRequired
};

const WrappedCreateMeetingForm = Form.create({
  name: 'create_meeting'
})(CreateMeeting);

export default WrappedCreateMeetingForm;
