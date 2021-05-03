const pool = require('./dbConection');

// Inserts a list of emails into the members table
// If there is a conflict (email already added) it does nothing
exports.insertMembers = async (emailList, businessId) => {
  let valueString = ''; 
  for (i = 0; i < emailList.length; i++) {
    valueString += ((valueString === '' ? '' : ', ') + 
      `('${emailList[i]}', '${businessId}')`);
  }
  const insert = 'INSERT INTO Members (memberemail, businessid) ' +
                  'VALUES ' + valueString + ' ON CONFLICT DO NOTHING RETURNING memberemail'  
  const query = {
    text: insert,
  };
  return pool.query(query)
  .then((response) => {
    console.log(response.rowCount + " Emails added in insertMembers");
  })
  .catch(error => {
    console.log("Error in insertMember response: " + error.stack);
  });
};

// Gets all member emails and userid's from the members table
// Returns an object with withId and with withoutId
exports.getMemberList = async (businessid) => {
  const select = 'SELECT memberemail FROM Members WHERE businessid = $1';
  const query = {
    text: select,
    values: [businessid],
  };
  
  return pool.query(query)
  .then((response) => {
    const rows = response.rows;  
    const emailList = [];
    for (i = 0; i < rows.length; i++) {
      emailList.push(rows[i].memberemail);
    }
    return emailList;
  })
  .catch((error) => {
    console.error("Error in getMemberList: " + error.stack);
    next(error);
  });

};


// removes user from members table
exports.removeMember = async (businessid, email) => {
    const deleteM = 'DELETE FROM Members WHERE businessid = $1 ' +
        'AND memberemail = $2 RETURNING memberemail';
    const query = {
      text: deleteM,
      values: [businessid, email],
    };
  
    const {rows} = await pool.query(query);
    return (rows.length);
  };
