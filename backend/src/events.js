const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

exports.create = async (req, res) => {
  const event = req.body;
  const eventid =
      await db.insertEvent(event.eventname, event.starttime, event.endtime,
      event.businessid, event.capacity);
  // add generated event ID to event object before returning
  event.eventid = eventid;
  res.status(201).send(event);
};

exports.getEvents = async (req, res) => {
  if (req.query.start) {
    // if start query provided, query DB for events starting at that time
    const events = await db.getEventsByStart(req.query.start);
    res.status(200).json(events);
  } else {
    // if no queries provided, query DB for all events
    const events = await db.getEvents();
    res.status(200).json(events);
  }
};

exports.getEventByID = async (req, res) => {
  const event = await db.getEventByID(req.params.eventid);
  // 200 if event found, 404 if not found
  if (!event) {
    res.status(404).send();
  } else {
    res.status(200).json(event);
  }
};

exports.signup = async (req, res) => {
  const eventid = req.params.eventid;
  const userid = req.payload.id;  // this doesn't work, userID is undefined
  const event = await db.getEventByID(req.params.eventid);
  // 404 if event not found
  if (!event) {
    res.status(404).send();
  } else {
    const userAttending = await db.checkUserAttending(eventid, userid);
    if (userAttending) {
      // if user already attending event, send 409
      res.status(409).send();
    } else {
      // if not already attending, add user to attendees then send 200
      await db.insertAttendees(eventid, userid);
      res.status(200).send();
    }
  }
};
