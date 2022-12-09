const {gettingQuestion, gettingAnswer, postingQuestion, postingAnswer, markingQuestionHelpful, markingAnswerHelpful, reportingQuestion, reportingAnswer} = require('./models.js')
const bodyParser = require("body-parser");

const currentData = {};


const getQuestion = (req, res) => {
  // console.log('req,res', req.params)
  gettingQuestion(req.params.product_id)
  .then((data) => {
    console.log(data,' inside controller masterInfoControl')
    res.status(200).json(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in getQuestion'))
    }
  })
}

const getAnswer = (req, res) => {
  gettingAnswer(req.params.question_id, 50)
  .then((data) => {
    //console.log(data,' inside controller masterInfoControl')
    res.status(200).json(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in getAnswer'))
    }
  })
}

const postQuestion = (req, res) => {
  console.log(req.data)
  let obj = {
    body: req.data.body,
    date: req.data.date,
    askerName: req.data.name,
    askerEmail: req.data.email,
    reported: req.data.reported,
    helpfulness: req.data.helpfulness,
    productId: req.data.productId
  }
  postingQuestion(obj)
  .then((data) => {
    //console.log(data,' inside controller masterInfoControl')
    res.status(200).send(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in postQuestion'))
    }
  })
}

const postAnswer = (req, res) => {
  let obj = {
    body: req.data.body,
    date: req.data.date,
    answererName: req.data.answererName,
    answererEmail: req.data.answerEmail,
    reported: req.data.reported,
    helpfulness: req.data.helpfulness,
    questionId: req.data.questionId,
    }
  postingAnswer(obj)
  .then((data) => {
    //console.log(data,' inside controller masterInfoControl')
    res.status(200).send(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in postAnswer'))
    }
  })
}

const markQuestionHelpful = (req, res) => {
  markingQuestionHelpful(req.params.question_id)
  .then((data) => {
    //console.log(data,' inside controller masterInfoControl')
    res.status(200).send(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in markQustionHelpfup'))
    }
  })
}

const markAnswerHelpful = (req, res) => {
  markingAnswerHelpful(req.params.answer_id)
  .then((data) => {
    console.log(data,' inside controller masterInfoControl')
    res.status(200).send(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in markAnswerHelpful'))
    }
  })
}


const reportQuestion = (req, res) => {
  reportingQuestion(req.params.question_id)
  .then((data) => {
    //console.log(data,' inside controller masterInfoControl')
    res.status(200).json(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in reportQuestion'))
    }
  })
}

const reportAnswer = (req, res) => {
  reportingAnswer(req.params.answer_id)
  .then((data) => {
    //console.log(data,' inside controller masterInfoControl')
    res.status(200).json(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in reportAnswer'))
    }
  })
}



module.exports = {
  getQuestion,
  getAnswer,
  postQuestion,
  postAnswer,
  markAnswerHelpful,
  markQuestionHelpful,
  reportQuestion,
  reportAnswer
}