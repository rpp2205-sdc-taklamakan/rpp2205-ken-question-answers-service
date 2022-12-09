const request = require("supertest")
const baseURL = "http://localhost:3001"
const express = require("express")
const app = express()


describe('QA Component Test', () => {
  test('Should render Widget Title', () => {
    request("tp://localhost:3001/qa/questions/77898/answers")
  .get('/qa/questions/:product_id')
  .end(function(err, res) {
  if (err) throw err;
  console.log(res.body.attachments);
  });
  });
});


app.listen(3001, () => console.log("Listening at port 3001"))
