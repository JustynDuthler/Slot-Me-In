-- File: createTables.sql
-- Purpose: creates all of the neccessary tables
-- to store user data, business data, events, attendess,
-- etc..

-- Users Tables
CREATE TABLE Users (
	userID uuid DEFAULT uuid_generate_v4(), 
	userName TEXT NOT NULL,
	Password TEXT NOT NULL,
    userEmail TEXT UNIQUE NOT NULL,
	PRIMARY KEY (userID)
);

-- Businesses Tables
CREATE TABLE Businesses (
	businessID uuid DEFAULT uuid_generate_v4(),
	businessName TEXT NOT NULL,
	Password TEXT NOT NULL,
	phoneNumber TEXT NOT NULL,
	businessEmail TEXT UNIQUE NOT NULL,
	PRIMARY KEY (businessID)
);

-- Events Table
CREATE TABLE Events (
	eventID uuid DEFAULT uuid_generate_v4(),
	eventName TEXT NOT NULL,
	businessID uuid,
	startTime TIMESTAMP NOT NULL,
	endTime TIMESTAMP NOT NULL,
	capacity INTEGER,
	PRIMARY KEY (eventID),
	FOREIGN KEY (businessID) REFERENCES Businesses
);

-- Attendees Table
CREATE TABLE Attendees (
	eventID uuid,
	userID uuid,
	numAttendees INTEGER NOT NULL,
	FOREIGN KEY (eventID) REFERENCES Events,
	FOREIGN KEY (userID) REFERENCES Users
);