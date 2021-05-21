/* test for adding members */
test('Inserting Members', async () => {
  await request.get('/api/test/get_business_token')
    .then(data => {
      request.put('/api/members/insertMember', 
      {Headers: 
        {Authorization: 'Bearer ' + data.body.auth_token},
      Body:
        ['dante@gmail.com', 'caitlyn@ucsc.edu']
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .then(data => {
        expect(data).toBeDefined();
      })
    });
})

/* test for deleting members */

/* test for getting members */

/* test for getting members business list */

/* test for getting a businesses restricted events */