const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.create = async (req, res) => {
  const event = req.body;
  // TODO: check if user logged in is business account
  //    if not business account, res.status(403).send()
  const eventID = 
      await db.insertEvent(event.name, event.startTime, event.endTime,
      event.businessID, event.capacity);
  // add generated event ID to event object before returning
  event.eventID = eventID;
  res.status(201).json(event);
};

exports.getEvents = async (req, res) => {
  // TODO: call db function to query for all events
  const events = [];
  // 200 and return events list
  res.status(200).json(events);
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

