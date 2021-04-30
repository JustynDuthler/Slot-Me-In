const db = require('./db');
const dotenv = require('dotenv');
dotenv.config();

exports.deleteMember = async (req, res) => {
  const businessid = req.payload.id;
  const email = req.body.email;
  db.getUserIDByEmail(email)
    .then(id => {
      db.removeMember(businessid, id)
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
    userID[i] = await db.getUserIDByEmail(req.body[i]);
  }
  /* get list of already added users */
  const existingMembers = await db.getMembersForBusiness(businessid);
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
    if (firstInsert == 0) {
      memberListString = memberListString +
          '(\'' + businessid + '\', \'' + req.body[i] +
          '\', \'' + userID[i] +'\')';
      firstInsert = 1;
    } else if (i < length -1) {
      memberListString = memberListString +
          ', (\'' + businessid + '\', \'' + req.body[i] +
          '\', \'' + userID[i] +'\')';
    } else {
      memberListString = memberListString +
          ', (\'' + businessid + '\', \'' + req.body[i] +
          '\', \'' + userID[i] +'\')';
    }
  }
  if (memberListString.length != 0) {
    const insertNum = await db.insertMembers(memberListString);
    console.log(insertNum);
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
  const memberIDs = await db.getMembersForBusiness(businessid);
  if (memberIDs === undefined) {
    const emptyUsers = [];
    res.status(200).json(emptyUsers);
  } else {
    /* construct userid list for query */
    let useridvalues = '';
    let firstInsert = 0;
    const length = memberIDs.length;
    for (i = 0; i < length; i++) {
      if (firstInsert == 0) {
        useridvalues = useridvalues + '(\'' + memberIDs[i].userid + '\')';
        firstInsert = 1;
      } else {
        useridvalues = useridvalues + ', (\'' + memberIDs[i].userid + '\')';
      }
    }
    console.log(useridvalues);

    const users = await db.getMemberUserInfo(useridvalues);
    console.log(users);
    res.status(200).json(users);
  }
};
