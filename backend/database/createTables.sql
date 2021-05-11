-- File: createTables.sql
-- Purpose: creates all of the neccessary tables
-- to store user data, business data, events, attendess,
-- etc..

DROP TABLE IF EXISTS Users;
-- Users Tables
CREATE TABLE Users (
	userid uuid  UNIQUE DEFAULT uuid_generate_v4(),
	username TEXT NOT NULL,
	password TEXT NOT NULL,
  useremail TEXT UNIQUE NOT NULL,
	PRIMARY KEY (userid)
);

DROP TABLE IF EXISTS Businesses;
-- Businesses Tables
CREATE TABLE Businesses (
	businessid uuid UNIQUE DEFAULT uuid_generate_v4(),
	businessname TEXT NOT NULL,
	password TEXT NOT NULL,
	phonenumber TEXT NOT NULL,
	businessemail TEXT UNIQUE NOT NULL,
  businessimagename TEXT DEFAULT 'stockPhoto.png',
	description VARCHAR(500) DEFAULT '',
	PRIMARY KEY (businessid)
);

DROP TABLE IF EXISTS RepeatingEvents;
-- Repeating Events Table
CREATE TABLE RepeatingEvents (
  repeatid uuid UNIQUE DEFAULT uuid_generate_v4(),
  eventname TEXT NOT NULL,
  description VARCHAR(500) DEFAULT '',
  businessid uuid,
  starttime TIMESTAMPTZ NOT NULL,
  endtime TIMESTAMPTZ NOT NULL,
  capacity INTEGER,
  sunday BOOLEAN,
  monday BOOLEAN,
  tuesday BOOLEAN,
  wednesday BOOLEAN,
  thursday BOOLEAN,
  friday BOOLEAN,
  saturday BOOLEAN,
  repeattype CHAR(1) DEFAULT 'w',     -- currently only 'w' for weekly, can implement more types later
  repeatend TIMESTAMPTZ,
  PRIMARY KEY (repeatid),
  FOREIGN KEY (businessid) REFERENCES Businesses
);

DROP TABLE IF EXISTS Events;
-- Events Table
CREATE TABLE Events (
  eventid uuid UNIQUE DEFAULT uuid_generate_v4(),
  eventname TEXT NOT NULL,
  description VARCHAR(500) DEFAULT '',
  businessid uuid,
  starttime TIMESTAMPTZ NOT NULL,
  endtime TIMESTAMPTZ NOT NULL,
  capacity INTEGER,
  repeatid uuid,
  PRIMARY KEY (eventid),
  FOREIGN KEY (businessid) REFERENCES Businesses,
  FOREIGN KEY (repeatid) REFERENCES RepeatingEvents ON DELETE CASCADE
);

DROP TABLE IF EXISTS Attendees;
-- Attendees Table
CREATE TABLE Attendees (
	eventid uuid,
	userid uuid,
	FOREIGN KEY (eventid) REFERENCES Events ON DELETE CASCADE,
	FOREIGN KEY (userid) REFERENCES Users
);

DROP TABLE IF EXISTS Members;
-- members tables
CREATE TABLE Members (
  memberemail TEXT NOT NULL,
  businessid uuid,
  FOREIGN KEY (businessid) REFERENCES Businesses
);
