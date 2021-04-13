-- File: createTables.sql
-- Purpose: creates all of the neccessary tables
-- to store user data, business data, events, attendess,
-- etc..

-- Users Tables
CREATE TABLE Users (
	userID uuid DEFAULT uuid_generate_v4(), 
	userName TEXT NOT NULL,
	Password TEXT,
    userEmail TEXT NOT NULL,
	PRIMARY KEY (userID)
);

-- Businesses Tables
CREATE TABLE Businesses (
	businessID uuid DEFAULT uuid_generate_v4(),
	businessName TEXT NOT NULL,
	Password TEXT,
	phoneNumber TEXT NOT NULL,
	businessEmail TEXT NOT NULL,
	PRIMARY KEY (businessID)
)