import React from 'react';
import { renderEmail } from 'react-html-email';
import { convertDeltaToHtml } from 'node-quill-converter';
import ShareEmail from '../shared/mailers/share-email';
import SummaryEmail from '../shared/mailers/summary-email';

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
const { db } = require('./db');

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://meeting-magic-backend.herokuapp.com/v1alpha1/graphql',
    credentials: 'include',
    fetch
  }),
  cache: new InMemoryCache()
});

const getSnapshots = async arr => {
  const queryIdxs = arr.map((_, i) => `$${i + 1}`).join(',');
  const queryString = `SELECT data FROM snapshots WHERE collection='agenda_notes' AND doc_id IN (${queryIdxs})`;

  return new Promise((resolve, reject) => {
    db.pool.query(queryString, arr, (err, res) => {
      if (res.rows.length) {
        resolve(res.rows.map(({ data }) => data));
      } else {
        reject(err || 'no data returned');
      }
    });
  });
};

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
    // eslint-disable-next-line no-console
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

  // get meeting data that is not included in the event data
  const { data } = await client.query({
    query: gql`
      query getMeeting($meetingId: uuid!) {
        meeting(where: { id: { _eq: $meetingId } }) {
          agenda_items {
            id
            title
            desc
            duration
            order
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

  const timezone = meeting.timezone || 'America/Los_Angeles';
  const startDtm = moment.tz(meeting.start_dtm, timezone);
  const endDtm = moment.tz(meeting.end_dtm, timezone);

  meeting.date = startDtm.format('L');
  meeting.time = `${startDtm.format('LT')} - ${endDtm.format('LT z')}`;
  meeting.agendaItems = data.meeting[0].agenda_items;
  meeting.agendaItems.sort((a, b) => a.order - b.order);

  // get notes as rich-text
  const notesData = await getSnapshots(
    meeting.agendaItems.map(item => `${item.id}`)
  );

  // convert rich-text to html component
  const noteElements = notesData.map(note => (
    // eslint-disable-next-line react/no-danger
    <div dangerouslySetInnerHTML={{ __html: convertDeltaToHtml(note) }} />
  ));

  // insert note component into meeting agenda item
  meeting.agendaItems = meeting.agendaItems.map((agendaItem, idx) => ({
    ...agendaItem,
    Notes: noteElements[idx]
  }));

  // render html email
  const htmlEmail = renderEmail(<SummaryEmail meeting={meeting} />);

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
        To: emails.map(Email => ({ Email })),
        Subject: `Meeting Summary: ${meeting.name}`,
        HTMLPart: htmlEmail
      }
    ]
  };

  const emailResponse = await mailjet
    .post('send', { version: 'v3.1' })
    .request(emailRequest)
    // eslint-disable-next-line no-console
    .catch(console.error);

  return res.json({ emailRequest, emailResponse });
});

module.exports = router;
