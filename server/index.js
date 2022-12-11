const express = require('express')
const bodyParser = require("body-parser");
const app = express();
const port = 3001;
const pgp = require('pg-promise')();
const db = pgp('postgres://kenkurita:@localhost:5432/questionanswer')
const {getQuestion, getAnswer, postQuestion, postAnswer, markAnswerHelpful, markQuestionHelpful, reportQuestion, reportAnswer} = require('./controller.js')


// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/',(req, res) => {
  res.status(200).json(getQuestion)
})

// get questions
app.get('/qa/questions/:product_id',(req, res) => {
  getQuestion(req, res)
})

// get answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  getAnswer(req, res)
});

// post question
app.post('/qa/questions', (req, res) => {
  postQuestion(req, res)
});

// post answer
app.post('/qa/questions/:question_id/answers', (req, res) => {
  postAnswer(req, res)
});

// put question as helpful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  markQuestionHelpful(req, res)
});

// put answer as helpful
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  markAnswerHelpful(req, res)
})

// question to report
app.put('/qa/questions/:question_id/report', (req, res) => {
  reportQuestion(req, res)
});

// put answer to report
app.put('/qa/answers/:answer_id/report', (req, res) => {
  reportAnswer(req, res)
});


app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})