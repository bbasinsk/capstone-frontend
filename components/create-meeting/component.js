import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Row, Col, Card, Typography } from 'antd';
import lodash from 'lodash';
import moment from 'moment-timezone';
import BasicInfo from './basic-info';
import AgendaItems from './agenda-items';
import Members from './members';
import OrganizerEmail from './organizer-email';

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
        const localDate = values.date.format('YYYY-MM-DD');
        const localStartTime = values.startTime.format('HH:mm:ss');
        const localEndTime = values.endTime.format('HH:mm:ss');
        const agendaItems = getFieldValue('agendaKeys').map(
          k => values.agendaItems[k]
        );

        const memberEmails = getFieldValue('memberKeys').map(
          k => values.members[k]
        );
        const organizerEmail = getFieldValue('email');
        const emails = [organizerEmail, ...memberEmails];

        // build the object to create the meeting
        const meeting = {
          name: values.name,
          location: values.location,
          localStartDtm: `${localDate}T${localStartTime}`,
          localEndDtm: `${localDate}T${localEndTime}`,
          timezone: moment.tz.guess(),
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
                getFieldValue={getFieldValue}
              />

              <Title level={2}>Your Email</Title>
              <OrganizerEmail
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
