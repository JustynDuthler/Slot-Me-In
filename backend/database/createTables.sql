-- File: createTables.sql
-- Purpose: creates all of the neccessary tables
-- to store user data, business data, events, attendess,
-- etc..

-- Users Tables
CREATE TABLE Users (
	userid uuid DEFAULT uuid_generate_v4(), 
	username TEXT NOT NULL,
	password TEXT NOT NULL,
  useremail TEXT UNIQUE NOT NULL,
	PRIMARY KEY (userid)
);

-- Businesses Tables
CREATE TABLE Businesses (
	businessid uuid DEFAULT uuid_generate_v4(),
	businessname TEXT NOT NULL,
	password TEXT NOT NULL,
	phonenumber TEXT NOT NULL,
	businessemail TEXT UNIQUE NOT NULL,
	PRIMARY KEY (businessid)
);

-- Events Table
CREATE TABLE Events (
	eventid uuid DEFAULT uuid_generate_v4(),
	eventname TEXT NOT NULL,
	businessid uuid,
	starttime TIMESTAMP NOT NULL,
	endtime TIMESTAMP NOT NULL,
	capacity INTEGER,
	PRIMARY KEY (eventid),
	FOREIGN KEY (businessid) REFERENCES Businesses
);

-- Attendees Table
CREATE TABLE Attendees (
	eventid uuid,
	userid uuid,
	FOREIGN KEY (eventid) REFERENCES Events,
	FOREIGN KEY (userid) REFERENCES Users
);