const db = require('./db');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const auth = require('./auth');
dotenv.config();

exports.addMembers = async (req, res) => {
    const businessid = req.payload.id;
    // create an array of userIDs
    let userID = []
    console.log(req.body);
    let length = req.body.length;
    /* fill userID array with userIDs corresponding to the emails in the
       same order */   
    for(i = 0; i < length; i++) {
        userID[i] = await db.getUserIDByEmail(req.body[i]);
    }
    // construct tuples to insert into members table
    let memberListString = '';
    for(i = 0; i < length; i++) {
        if (i < length -1) {
            memberListString = memberListString + '(\'' + businessid + '\', \'' + req.body[i] + '\', \'' + userID[i] +'\'), ' ;
        } else {
            memberListString = memberListString + '(\'' + businessid + '\', \'' + req.body[i] + '\', \'' + userID[i] +'\')' ;
        }
        
    }

    const insertNum = db.insertMembers(memberListString);
    if (insertNum == 0) {
        res.status(400).send();
    } else {
        res.status(200).send();
    }
}

