-- Inserts dummy data into Users table for testing
INSERT INTO Users(userID, userName, Password, userEmail)
VALUES ('00000000-0000-0000-0000-000000000000', 'Jeff', 'PaSWord', 'jeff@ucsc.edu');

INSERT INTO Businesses(businessID, businessName, Password, phoneNumber, businessEmail)
VALUES ('00000000-0000-0000-0000-000000000000', 'Test Inc.', 'Pwd', '000-000-0000', 'contact@testinc.com');

INSERT INTO Events(eventID, eventName, businessID, startTime, endTime, capacity)
VALUES ('00000000-0000-0000-0000-000000000010', 'Test Event.', '00000000-0000-0000-0000-000000000000', '2011-01-01 00:00:00', '2012-01-01 00:00:00', 10);