const db = require('../db/eventsDb');
const dotenv = require('dotenv');
dotenv.config();

exports.getTotalAttendees = async (req, res) => {
  const attendees = await db.checkRemainingEventCapacity(req.params.eventid);
  res.status(200).json(attendees);
};
