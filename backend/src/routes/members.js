const memberDb = require('../db/memberDb');
const userDb = require('../db/userDb');
const dotenv = require('dotenv');
dotenv.config();

// Deletes row in members table based on the
// memberemail and userid
exports.deleteMember = async (req, res) => {
  const businessid = req.payload.id;
  const email = req.body.email;

  memberDb.removeMember(businessid, email)
    .then(length => {
      res.status(200).send();
    })
    .catch(err => {
      // Couldn't remove the email
      console.log(err);
      res.status(409).send();
    })
}

// Add members to members table
exports.addMembers = async (req, res) => {
  const businessid = req.payload.id;

  memberDb.insertMembers(req.body, businessid)
  .then((response) => {
    res.status(200).send();
  })
  .catch((error) => {
    console.log("error in addMembers: " + error.stack);
    res.status(409).send();
  });
};

// Returns an array of emails
exports.getMembers = async (req, res) => {
  const businessid = req.payload.id;
  const emailList = await memberDb.getMemberList(businessid);
  let memberList = []
  for(i = 0; i < emailList.length; i++) {
    const user = await memberDb.getMemberUserId(emailList[i]);
    console.log(user);
    let member = {
      email: emailList[i],
      userid: user.userid
    }
    memberList.push(member);
  }
  console.log(memberList);
  res.status(200).json(memberList);
}
