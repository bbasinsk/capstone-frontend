const router = require('express').Router();

router.get(`/webhook`, async (req, res) => {
  const meetingId = req.get('meeting-id');

  // not on a meeting
  if (!meetingId) {
    return res.json({
      'X-Hasura-Role': 'anonymous'
    });
  }

  // attendee of a meeting
  return res.json({
    'X-Hasura-Role': 'attendee',
    'X-Hasura-Meeting-Id': meetingId
  });
});

module.exports = router;
