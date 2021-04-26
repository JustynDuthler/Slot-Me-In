const db = require('./db');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();

exports.addMembers = async (req, res) => {
    const businessid = req.paylod.id;
    // create an array of userIDs
    let userID = []
    let length = req.body.emailList.length;
    /* fill userID array with userIDs corresponding to the emails in the
       same order */   
    for(i = 0; i < length; i++) {
        userID[i] = db.getUserIDByEmail(req.body.emailList[i]);
        console.log(userID[i])
    }
    // construct tuples to insert into members table
    let memberListString = '';
    for(i = 0; i < length; i++) {
        memberListString.push(businessid + req.body.emailList[i] + userID[i]);
    }

    const insertNum = db.insertMembers(memberListString);
    if (insertNum == 0) {
        res.status(500).send();
    } else {
        res.statis(200).send();
    }
}

