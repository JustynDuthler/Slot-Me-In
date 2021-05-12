const eventsDb = require('../db/eventsDb');
const attendeesDb = require('../db/attendeesDb');
const dotenv = require('dotenv');
dotenv.config();

exports.create = async (req, res) => {
  const event = req.body;
  if (event.repeat) {
  // --- REPEATING EVENT ---
    // insert to RepeatingEvents and get repeatid, add to event object
    event.repeatid =
        await eventsDb.insertRepeatingEvent(event.eventname, event.description,
            req.payload.id, event.starttime, event.endtime, event.capacity,
            event.repeatdays['sunday'], event.repeatdays['monday'],
            event.repeatdays['tuesday'], event.repeatdays['wednesday'],
            event.repeatdays['thursday'], event.repeatdays['friday'],
            event.repeatdays['saturday'], event.repeattype, event.repeatend);
    // create days array for use with getDay()
    // (ex: if date.getDay() is 0, days[0] is Sunday)
    const days =
        ['sunday', 'monday', 'tuesday', 'wednesday',
          'thursday', 'friday', 'saturday'];
    // create Date objects for easy manipulation
    const start = new Date(event.starttime);
    const end = new Date(event.endtime);
    const repeatend = new Date(event.repeatend);
    // continue repeating event insert until after specified repeatend date
    // create currentDay obj w/o hrs/mins to ignore time in date comparison
    // https://stackoverflow.com/questions/2698725/
    let currentDay = new Date(
        Date.UTC(start.getUTCFullYear(), start.getUTCMonth(),
            start.getUTCDate()));
    while (currentDay.getTime() <= repeatend.getTime()) {
      // only insert to Events table if on a repeat day
      // use days array to get current day name
      if (event.repeatdays[days[start.getDay()]]) {
        const eventid =
            await eventsDb.insertEvent(
                event.eventname, start.toISOString(), end.toISOString(),
                req.payload.id, event.capacity, event.description,
                event.repeatid);
        // set eventid on first inserted event only
        if (!event.eventid) event.eventid = eventid;
      }
      // increment event start and end dates by 1 day
      start.setDate(start.getDate() + 1);
      end.setDate(end.getDate() + 1);
      // update currentDay object
      currentDay = new Date(
          Date.UTC(start.getUTCFullYear(), start.getUTCMonth(),
              start.getUTCDate()));
    }
  } else {
  // --- NON REPEATING EVENT ---
    // for non-repeating event, insert to Events table
    const eventid =
        await eventsDb.insertEvent(event.eventname, event.starttime,
            event.endtime, req.payload.id, event.capacity, event.description);
    event.eventid = eventid;
  }
  // return 201 with event
  res.status(201).send(event);
};

exports.delete = async (req, res) => {
  const event = await eventsDb.getEventByID(req.params.eventid);
  if (!event) {
    // 404 if event not found
    res.status(404).send();
  } else {
    if (req.body.deleteAll && event.repeatid) {
      // deleteAll is true and event is an instance of a repeating event
      // deletion of RepeatingEvent will cascade to Events
      await eventsDb.deleteRepeatingEvent(event.repeatid);
    } else {
      // deleteAll is false, or event is not part of a repeating event
      await eventsDb.deleteEvent(req.params.eventid);
    }
    // 200 after successful deletion
    res.status(200).send();
  }
};

exports.getEvents = async (req, res) => {
  // if business account, only show the events made by that business
  if (req.payload.userType == 'business') {
    const events = await eventsDb.getBusinessEvents(req.payload.id);
    res.status(200).json(events);
  } else if (req.payload.userType == 'user') {
    const events = await eventsDb.getEvents(
        req.query.start, req.query.end, req.query.search);
    res.status(200).json(events);
  }
};

exports.getEventByID = async (req, res) => {
  const event = await eventsDb.getEventByID(req.params.eventid);
  // 200 if event found, 404 if not found
  if (!event) {
    res.status(404).send();
  } else {
    res.status(200).json(event);
  }
};

exports.signup = async (req, res) => {
  const eventid = req.params.eventid;
  const userid = req.payload.id; // this doesn't work, userID is undefined
  const event = await eventsDb.getEventByID(req.params.eventid);
  // 404 if event not found
  if (!event) {
    res.status(404).send();
  } else {
    const userAttending = await attendeesDb.checkUserAttending(eventid, userid);
    if (userAttending) {
      // if user already attending event, send 409
      res.status(409).send();
    } else {
      // if capacity is full
      const capacity = await eventsDb.checkRemainingEventCapacity(eventid);
      if (capacity.length === event.capacity) {
        console.log('Event is already full.');
      } else {
        // if not already attending, add user to attendees then send 200
        await attendeesDb.insertAttendees(eventid, userid);
        res.status(200).send();
      }
    }
  }
};

// Sends an array of events that are marked as public in the db
// this is for display on the home page
// This route doesn't use JWT authorization
exports.publicEvents = async (req, res, next) => {
  eventsDb.getPublicEvents()
  .then((events) => {
    res.status(200).send(events);
  })
  .catch((error) => {
    console.log("Error in publicEvents: " + error);
    error.status = 500;
    next(error);
  });
};