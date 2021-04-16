-- Inserts dummy data into Users table for testing
-- Unhashed password is PaSWord
INSERT INTO Users(userid, username, password, useremail)
VALUES ('00000000-0000-0000-0000-000000000000', 'Jeff', '$2b$10$yM6wHn3IDtPttfUKnZ3mge/wTJKcxBnFSPNqm/2DIusW5KPYWNihm', 'jeff@ucsc.edu');

--Unhashed password is Pwd
INSERT INTO Businesses(businessid, businessname, password, phonenumber, businessemail)
VALUES ('00000000-0000-0000-0000-000000000000', 'Test Inc.', '$2b$10$7MM4cgfts0BPZP1NzZYrsuq/zLgn48..ayfZXXcVgZ5X5O4IGgxrq', '000-000-0000', 'contact@testinc.com');

INSERT INTO Events(eventid, eventname, businessid, starttime, endtime, capacity)
VALUES ('00000000-0000-0000-0000-000000000010', 'Test Event 1', '00000000-0000-0000-0000-000000000000', '2021-02-01T09:22:11.000Z', '2021-02-01T09:22:11.000Z', 10);

INSERT INTO Events(eventid, eventname, businessid, starttime, endtime, capacity)
VALUES ('00000000-0000-0000-0000-000000000020', 'Test Event 2', '00000000-0000-0000-0000-000000000000', '2021-05-01T09:22:11.000Z', '2021-05-01T09:22:11.000Z', 10);

INSERT INTO Attendees(eventid, userid)
VALUES ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000');


