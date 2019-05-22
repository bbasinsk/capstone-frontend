import React from 'react';
import { renderEmail } from 'react-html-email';
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import sgMail from '@sendgrid/mail';
import ShareEmail from '../shared/mailers/share-email';
import SummaryEmail from '../shared/mailers/summary-email';

const gql = require('graphql-tag');
const router = require('express').Router();
const moment = require('moment-timezone');
const ical = require('ical-generator');

const { ApolloClient } = require('apollo-client');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { HttpLink } = require('apollo-link-http');
const fetch = require('isomorphic-fetch');
const { db } = require('./db');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const cal = ical({ domain: 'neatmeet.co', name: 'NeatMeet' });

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'https://meeting-magic-backend.herokuapp.com/v1alpha1/graphql',
    credentials: 'include',
    fetch,
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET
    }
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

  // render html
  const htmlEmail = renderEmail(<ShareEmail meeting={meeting} />);

  // get email addresses
  const emails = data.meeting[0].meeting_members
    .filter(member => member.send_agenda)
    .map(member => member.member_user.email);

  // create calendar invite

  cal.createEvent({
    start: meeting.start_dtm,
    end: meeting.end_dtm,
    summary: meeting.name,
    location: meeting.location,
    url: `https://www.neatmeet.co/meeting/${meeting.id}`,
    timezone,
    attendees: emails.map(email => ({ email }))
  });
  const calInvite = Buffer.from(cal.toString()).toString('base64');

  const emailMsg = {
    to: emails,
    from: 'NeatMeet <noreply@neatmeet.co>',
    subject: `Meeting Invite & Agenda: ${meeting.name}`,
    html: htmlEmail,
    attachments: [
      {
        content: calInvite,
        filename: 'invite.ics',
        type: 'text/calendar'
      }
    ]
  };

  // eslint-disable-next-line no-console
  const emailResponse = await sgMail.send(emailMsg).catch(console.error);

  return res.json({ emailMsg, emailResponse });
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
            send_summary
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
  const noteElements = notesData.map(note => {
    const converter = new QuillDeltaToHtmlConverter(note.ops || [], {});
    return (
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: converter.convert() }}
        style={{
          borderLeft: '2px solid rgba(0, 0, 0, 0.2)',
          paddingLeft: '16px'
        }}
      />
    );
  });

  // insert note component into meeting agenda item
  meeting.agendaItems = meeting.agendaItems.map((agendaItem, idx) => ({
    ...agendaItem,
    Notes: noteElements[idx]
  }));

  // render html email
  const htmlEmail = renderEmail(<SummaryEmail meeting={meeting} />);

  // get emails
  const emails = data.meeting[0].meeting_members
    .filter(member => member.send_summary)
    .map(member => member.member_user.email);

  const emailMsg = {
    to: emails,
    from: 'NeatMeet <noreply@neatmeet.co>',
    subject: `Meeting Summary: ${meeting.name}`,
    html: htmlEmail
  };

  // eslint-disable-next-line no-console
  const emailResponse = await sgMail.send(emailMsg).catch(console.error);

  return res.json({ emailMsg, emailResponse });
});

module.exports = router;
