const db = require('./db');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const auth = require('./auth');
const { use } = require('./app');
dotenv.config();

exports.addMembers = async (req, res) => {
    const businessid = req.payload.id;
    /* create an array of userIDs */
    let userID = []
    
    let length = req.body.length;
    /* fill userID array with userIDs corresponding to the emails in the
       same order */
    for(i = 0; i < length; i++) {
        userID[i] = await db.getUserIDByEmail(req.body[i]);
    }
    /* get list of already added users */
    let existingMembers = await db.getMembersForBusiness(businessid);
    /* construct tuples to insert into members table */
    let memberListString = '';
    let existFlag = 0;
    let firstInsert = 0;
    for(i = 0; i < length; i++) {
        /* set flag if userid is already a member */
        for (j = 0; j < existingMembers.length; j++) {
            if(userID[i] == existingMembers[j].userid) {
                existFlag = 1;
            }
        }
        /* if userid is already a member or not a user skip it */
        if (existFlag == 1 || userID[i] == null) {
            existFlag = 0;
            continue;
        }
        if (firstInsert == 0) {
            memberListString = memberListString + '(\'' + businessid + '\', \'' + req.body[i] + '\', \'' + userID[i] +'\')';
            firstInsert = 1;
        } else if (i < length -1) {
            memberListString = memberListString + ', (\'' + businessid + '\', \'' + req.body[i] + '\', \'' + userID[i] +'\')' ;
        } else {
            memberListString = memberListString + ', (\'' + businessid + '\', \'' + req.body[i] + '\', \'' + userID[i] +'\')' ;
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
}
