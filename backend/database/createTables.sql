-- File: createTables.sql
-- Purpose: creates all of the neccessary tables
-- to store user data, business data, events, attendess,
-- etc..

-- Users Tables
CREATE TABLE Users (
	userID INTEGER, 
	userName TEXT,
	Password TEXT,
    userEmail TEXT,
	PRIMARY KEY (userID)
);

-- Businesses Tables
CREATE TABLE Businesses (
	businessID INTEGER,
	businessName TEXT,
	Password TEXT,
	phoneNumber TEXT,
	businessEmail TEXT,
	PRIMARY KEY (businessID)
)