const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

exports.getTotalAttendees = async (req, res) => {
  const event = await db.checkRemainingEventCapacity(req.params.eventid);
  // 200 if event found, 404 if not found
  if (!event) {
    res.status(404).send();
  } else {
    res.status(200).json(event);
  }
};