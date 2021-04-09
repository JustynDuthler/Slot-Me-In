-- File: createTables.sql
-- Purpose: creates all of the neccessary tables
-- to store user data, business data, events, attendess,
-- etc..

DROP SCHEMA db CASCADE;
CREATE SCHEMA db;

-- Users Tables
CREATE TABLE Users (
	userID INTEGER, 
	userName TEXT,
	Password TEXT,
    Email TEXT,
	PRIMARY KEY (userID)
);