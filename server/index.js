const express = require('express')
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const pgp = require('pg-promise')();
const db = pgp('postgres://kenkurita:@localhost:5432/questionanswer')


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Ken Service');
})

// get questions
app.get('/qa/questions/:product_id', (req, res) => {
  console.log('inside productId')
  res.status(200).send(console.log('inside get quesitons'))
});

// get answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  console.log('inside get answers')
});

// post question
app.post('/qa/questions', (req, res) => {
  console.log('inside post question')
});

// post answer
app.post('/qa/questions/:question_id/answers', (req, res) => {
  console.log('inside post answer')
});

// put question as helpful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  console.log('inside put question as helpful')
});

// put question to report
app.put('/qa/questions/:question_id/report', (req, res) => {
  console.log('inside put question to report')
});

// put answer as helpful
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  console.log('put answer as helpful')
});

// put answer to report
app.put('/qa/answers/:answer_id/report', (req, res) => {
  console.log('put answer to report')
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})