const memberDb = require('../db/memberDb');
const businessDb = require('../db/businessDb');
const dotenv = require('dotenv');
dotenv.config();

// Deletes row in members table based on the
// memberemail and userid
exports.deleteMember = async (req, res) => {
  const businessid = req.payload.id;
  const email = req.body.email;
  /* get removed member info */
  const removedMember = await memberDb.getMemberUserNameID(email);
  const member = {
    username: (removedMember === null ? null : removedMember.username),
    email: email,
    userid: (removedMember === null ? null : removedMember.userid),
  };

  memberDb.removeMember(businessid, email)
      .then((length) => {
        res.status(200).json(member);
      })
      .catch((err) => {
      // Couldn't remove the email
        console.log(err);
        res.status(409).send();
      });
};

// Add members to members table
exports.addMembers = async (req, res) => {
  const businessid = req.payload.id;
  /* fill member list object with email, username, userid */
  const memberList = [];
  for (let i = 0; i < req.body.length; i++) {
    const user = await memberDb.getMemberUserNameID(req.body[i]);
    const member = {
      username: (user === null ? null : user.username),
      email: req.body[i],
      userid: (user === null ? null : user.userid),
    };
    memberList.push(member);
  }
  memberDb.insertMembers(req.body, businessid)
      .then((response) => {
        res.status(200).json(memberList);
      })
      .catch((error) => {
        console.log('error in addMembers: ' + error.stack);
        res.status(500).send();
      });
};

// Returns an array of emails
exports.getMembers = async (req, res) => {
  const businessid = req.payload.id;
  const emailList = await memberDb.getMemberList(businessid);
  const memberList = [];
  for (let i = 0; i < emailList.length; i++) {
    const user = await memberDb.getMemberUserNameID(emailList[i]);
    const member = {
      username: (user === null ? null : user.username),
      email: emailList[i],
      userid: (user === null ? null : user.userid),
    };
    memberList.push(member);
  }
  res.status(200).json(memberList);
};

// Returns businesses that a member is a part of
exports.getMemberBusinesses = async (req, res) => {
  const businesses = await memberDb.getMemberBusinesses(req.params.useremail);

  // get businesses based on businessid
  const businessList = [];
  for (let i = 0; i < businesses.length; i++) {
    const business = await businessDb.selectBusiness(businesses[i].businessid);
    const businessData = {
      businessid: business.businessid,
      businessname: business.businessname,
      email: business.businessemail,
      phonenumber: business.phonenumber,
      description: business.description,
    };
    businessList.push(businessData);
  }
  res.status(200).json(businessList);
};

// Returns restricted events for all businesses a user is a part of
exports.getRestrictedEvents = async (req, res) => {
  const businesses = await memberDb.getMemberBusinesses(req.params.useremail);
  const now = req.query.all ? new Date('1/1/1900') : new Date(Date.now());
  let restrictedEventList = []

  for (var i = 0; i < businesses.length; i++) {
    // get restricted events for the business
    const restrictedEvents = await memberDb.getBusinessRestrictedEvents(
        businesses[i].businessid);
    for (let j = 0; j < restrictedEvents.length; j++) {
      // push each event
      const starttime = new Date(restrictedEvents[j]['starttime'])
      if (starttime >= now)
        restrictedEventList.push(restrictedEvents[j]);
    }
  }
  res.status(200).json(restrictedEventList);
};
