const memberDb = require('../db/memberDb');
const userDb = require('../db/userDb');
const dotenv = require('dotenv');
dotenv.config();

exports.deleteMember = async (req, res) => {
  const businessid = req.payload.id;
  const email = req.body.email;
  userDb.getUserIDByEmail(email)
    .then(id => {
      memberDb.removeMember(businessid, id)
        .then(length => {
          res.status(200).send();
        })
        .catch(err => {
          // Couldn't remove the email
          console.log(err);
          res.status(409).send();
        })
    })
    .catch(err => {
      // Couldn't find userID from email
      console.log(err);
      res.status(409).send();
    });

}

exports.addMembers = async (req, res) => {
  const businessid = req.payload.id;
  /* create an array of userIDs */
  const userID = [];
  const length = req.body.length;
  /* fill userID array with userIDs corresponding to the emails in the
       same order */
  for (i = 0; i < length; i++) {
    userID[i] = await userDb.getUserIDByEmail(req.body[i]);
  }
  /* get list of already added users */
  const existingMembers = await memberDb.getMembersForBusiness(businessid);
  /* construct tuples to insert into members table */
  let memberListString = '';
  let existFlag = 0;
  let firstInsert = 0;
  let lengthExisting = 0;
  if (existingMembers !== undefined) {
    lengthExisting = existingMembers.length;
  }
  for (i = 0; i < length; i++) {
    /* set flag if userid is already a member */
    for (j = 0; j < lengthExisting; j++) {
      if (userID[i] == existingMembers[j].userid) {
        existFlag = 1;
      }
    }
    /* if userid is already a member or not a user skip it */
    if (existFlag == 1 || userID[i] == null) {
      existFlag = 0;
      continue;
    }
    /* Adds a comma between the values after the first element.
    data is (businessid, email, userid) for members table */
    memberListString += (memberListString === '' ? '' : ',') +
      '(\'' + businessid + '\', \'' + req.body[i] + '\', \'' + userID[i] +'\')';
  }
  if (memberListString.length != 0) {
    const insertNum = await memberDb.insertMembers(memberListString);
    if (insertNum == 0) {
      res.status(500).send();
    } else {
      res.status(200).send();
    }
  } else {
    res.status(409).send();
  }
};

exports.getMembers = async (req, res) => {
  const businessid = req.payload.id;
  /* query to get all userids of members */
  const memberIDs = await memberDb.getMembersForBusiness(businessid);
  if (memberIDs === undefined) {
    const emptyUsers = [];
    res.status(200).json(emptyUsers);
  } else {
    /* construct userid list for query */
    let useridvalues = '';
    let firstInsert = 0;
    const length = memberIDs.length;
    for (i = 0; i < length; i++) {
      // adds a comma if i > 0
      useridvalues += (i ? ',' : '') + '(\'' + memberIDs[i].userid + '\')';
    }

    const users = await memberDb.getMemberUserInfo(useridvalues);
    res.status(200).json(users);
  }
};
