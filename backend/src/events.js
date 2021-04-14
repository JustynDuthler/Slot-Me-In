const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

exports.create = async (req, res) => {
  const event = req.body;
  // TODO: check if user logged in is business account
  //    if not business account, res.status(403).send()
  const eventID =
      await db.insertEvent(event.eventname, event.starttime, event.endtime,
      event.businessid, event.capacity);
  // add generated event ID to event object before returning
  event.eventid = eventID;
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
  const event = await db.getEventByID(req.params.eventID);
  // 200 if event found, 404 if not found
  if (!event) {
    res.status(404).send();
  } else {
    res.status(200).json(event);
  }
};

exports.signup = async (req, res) => {
  // const eventID = req.params.eventID;
  // const userID = req.body.userID;
  // TODO: call db function to query for event with ID
  const event = {};
  // 200 if event found, 404 if not found
  if (!event) {
    res.status(404).send();
  }
  // TODO: query db to check if userID already signed up for eventID
  //    if already signed up, res.status(409).send()
  // TODO: query db to add user to Attendees of event
  res.status(200).send();
};
