-- File: createTables.sql
-- Purpose: creates all of the neccessary tables
-- to store user data, business data, events, attendess,
-- etc..

-- Users Tables
CREATE TABLE Users (
	userid uuid  UNIQUE DEFAULT uuid_generate_v4(), 
	username TEXT NOT NULL,
	password TEXT NOT NULL,
  useremail TEXT UNIQUE NOT NULL,
	PRIMARY KEY (userid)
);

-- Businesses Tables
CREATE TABLE Businesses (
	businessid uuid UNIQUE DEFAULT uuid_generate_v4(),
	businessname TEXT NOT NULL,
	password TEXT NOT NULL,
	phonenumber TEXT NOT NULL,
	businessemail TEXT UNIQUE NOT NULL,
	PRIMARY KEY (businessid)
);

-- Events Table
CREATE TABLE Events (
	eventid uuid UNIQUE DEFAULT uuid_generate_v4(),
	eventname TEXT NOT NULL,
  description VARCHAR(500) DEFAULT '',
	businessid uuid,
	starttime TIMESTAMP NOT NULL,
	endtime TIMESTAMP NOT NULL,
	capacity INTEGER,
  repeat BOOLEAN NOT NULL,
  repeatid uuid,
	PRIMARY KEY (eventid),
	FOREIGN KEY (businessid) REFERENCES Businesses,
  FOREIGN KEY (repeatid) REFERENCES RepeatingEvents
);

-- Repeating Events Table
CREATE TABLE RepeatingEvents (
  repeatid uuid UNIQUE DEFAULT uuid_generate_v4(),
  businessid uuid,
  repeattype CHAR(1) DEFAULT 'w',     -- currently only 'w' for weekly, can implement more types later
  sunday BOOLEAN,
  monday BOOLEAN,
  tuesday BOOLEAN,
  wednesday BOOLEAN,
  thursday BOOLEAN,
  friday BOOLEAN,
  saturday BOOLEAN,
  enddate TIMESTAMP,
  PRIMARY KEY (repeatid),
  FOREIGN KEY (businessid) REFERENCES Businesses
);

-- Attendees Table
CREATE TABLE Attendees (
	eventid uuid,
	userid uuid,
	FOREIGN KEY (eventid) REFERENCES Events ON DELETE CASCADE,
	FOREIGN KEY (userid) REFERENCES Users
);