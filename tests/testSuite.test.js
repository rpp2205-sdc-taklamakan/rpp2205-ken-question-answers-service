const httpMocks = require('node-mocks-http');
const {postQuestion} = require('../server/controller.js')




describe('QA Component Test', () => {
  const req = httpMocks.createRequest(
    {body: {
      data: 'some data from api',
      data2: 'some other data from api',
    }}
  );
  const res = httpMocks.createResponse();
  postQuestion(req,res)
});

// describe.only('Post Question', (done) => {
//   test('It should return 200 when posting a question', async () => {
//     moxios.stubRequest(`http://localhost:3001/qa/questions`, {
//       status: 200
//     })
//   })
// })


// app.listen(3001, () => console.log("Listening at port 3001"))
