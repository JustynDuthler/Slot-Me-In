-- Inserts dummy data into Users table for testing
-- Unhashed password is PaSWord
INSERT INTO Users(userName, Password, userEmail)
VALUES ('Jeff', '$2b$10$yM6wHn3IDtPttfUKnZ3mge/wTJKcxBnFSPNqm/2DIusW5KPYWNihm', 'jeff@ucsc.edu');

--Unhashed password is Pwd
INSERT INTO Businesses(businessID, businessName, Password, phoneNumber, businessEmail)
VALUES ('00000000-0000-0000-0000-000000000000', 'Test Inc.', '$2b$10$7MM4cgfts0BPZP1NzZYrsuq/zLgn48..ayfZXXcVgZ5X5O4IGgxrq', '000-000-0000', 'contact@testinc.com');

INSERT INTO Events(eventID, eventName, businessID, startTime, endTime, capacity)
VALUES ('00000000-0000-0000-0000-000000000010', 'Test Event.', '00000000-0000-0000-0000-000000000000', '2011-01-01 00:00:00', '2012-01-01 00:00:00', 10);
