import React from 'react';
import { renderEmail } from 'react-html-email';
import ShareEmail from '../shared/mailers/share-email';

const gql = require('graphql-tag');
const router = require('express').Router();
const moment = require('moment-timezone');

const mailjet = require('node-mailjet').connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

const { ApolloClient } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { HttpLink } = require('apollo-link-http');
const fetch = require('isomorphic-fetch');

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://meeting-magic-backend.herokuapp.com/v1alpha1/graphql',
    credentials: 'include',
    fetch
  }),
  cache: new InMemoryCache()
});

// –––––––––––––––––––––––––––––––––––––––
// for sending the Meeting Invite & Agenda
// –––––––––––––––––––––––––––––––––––––––
router.post(`/email/agenda`, async (req, res) => {
  const meeting = req.body.event.data.new;

  const { data } = await client.query({
    query: gql`
      query getMeeting($meetingId: uuid!) {
        meeting(where: { id: { _eq: $meetingId } }) {
          agenda_items {
            id
            title
            desc
            duration
          }
          meeting_members {
            member_user {
              email
            }
            send_agenda
          }
        }
      }
    `,
    variables: { meetingId: meeting.id }
  });

  const timezone = meeting.timezone || 'America/Los_Angeles';
  const startDtm = moment.tz(meeting.start_dtm, timezone);
  const endDtm = moment.tz(meeting.end_dtm, timezone);

  meeting.date = startDtm.format('L');
  meeting.time = `${startDtm.format('LT')} - ${endDtm.format('LT z')}`;
  meeting.agendaItems = data.meeting[0].agenda_items;

  const htmlEmail = renderEmail(<ShareEmail meeting={meeting} />);

  const emails = data.meeting[0].meeting_members
    .filter(member => member.send_agenda)
    .map(member => member.member_user.email);

  const emailRequest = {
    Messages: [
      {
        From: {
          Email: 'noreply@neatmeet.co',
          Name: 'NeatMeet'
        },
        To: emails.map(Email => ({ Email })),
        Subject: `Meeting Invite & Agenda: ${meeting.name}`,
        HTMLPart: htmlEmail
      }
    ]
  };

  const emailResponse = await mailjet
    .post('send', { version: 'v3.1' })
    .request(emailRequest)
    .catch(console.error);

  return res.json({ emailRequest, emailResponse });
});

// –––––––––––––––––––––––––––––––
// for sending the Meeting Summary
// –––––––––––––––––––––––––––––––
router.post(`/email/summary`, async (req, res) => {
  const meeting = req.body.event.data.new;

  if (meeting.status !== 'COMPLETE') {
    return res.sendStatus(204);
  }

  const timezone = meeting.timezone || 'America/Los_Angeles';
  const startDtm = moment.tz(meeting.start_dtm, timezone);
  const endDtm = moment.tz(meeting.end_dtm, timezone);

  const date = startDtm.format('L');
  const startTime = startDtm.format('LT');
  const endTime = endDtm.format('LT z');

  const { data } = await client.query({
    query: gql`
      query getMeeting($meetingId: uuid!) {
        meeting(where: { id: { _eq: $meetingId } }) {
          agenda_items {
            id
            title
            desc
            duration
          }
          meeting_members {
            member_user {
              email
            }
          }
        }
      }
    `,
    variables: { meetingId: meeting.id }
  });

  const agendaItems = data.meeting[0].agenda_items;
  const emails = data.meeting[0].meeting_members.map(
    member => member.member_user.email
  );

  const emailRequest = {
    Messages: [
      {
        From: {
          Email: 'noreply@neatmeet.co',
          Name: 'NeatMeet'
        },
        To: emails.map(email => ({ Email: email })),
        TemplateID: 822585,
        TemplateLanguage: true,
        Subject: `Meeting Summary: ${meeting.name}`,
        Variables: {
          meeting_name: meeting.name,
          meeting_date: date,
          meeting_time: `${startTime} - ${endTime}`,
          meeting_location: meeting.location || '',
          meeting_url: `https://www.neatmeet.co/meeting/${meeting.id}`,
          agenda_items: agendaItems || []
        }
      }
    ]
  };

  const emailResponse = await mailjet
    .post('send', { version: 'v3.1' })
    .request(emailRequest)
    .catch(console.error);

  return res.json({ emailRequest, emailResponse });
});

module.exports = router;