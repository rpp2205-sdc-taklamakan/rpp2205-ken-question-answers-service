const {gettingQuestion, gettingAnswer, postingQuestion, postingAnswer, markingQuestionHelpful, markingAnswerHelpful, reportingQuestion, reportingAnswer} = require('./models.js')
const bodyParser = require("body-parser");

const currentData = {};


const getQuestion = async (req, res) => {
  // console.log('req,res', req.params)
  const getQ = await gettingQuestion(req.query.product_id, req.query.count)
  if (getQ) {
    res.status(200).json(getQ)
  } else {
    res.status(500).send(getQ)
  }
}

const getAnswer = (req, res) => {
  gettingAnswer(req.params.question_id)
  .then((data) => {
    console.log(data,' inside controller masterInfoControl')
    res.status(200).json(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in getAnswer'))
    }
  })
}

const postQuestion = async (req, res) => {
  // console.log(req.body, 'inside controller postQuestion')
  const postQ = await postingQuestion(req.body)
  console.log(postQ, 'inside constroller postQuestion')
  if (!postQ) {
    return res.status(200)
  } else {
    return res.status(500).send(postQ)
  }
}

const postAnswer = async (req, res) => {
  const postA = await postingAnswer(req.body)
  if (!postA) {
    return res.status(200)
  } else {
    return res.status(500).send(postA)
  }
}

const markQuestionHelpful = async (req, res) => {
  const questionH = await markingQuestionHelpful(req.params.question_id)
  if (!questionH) {
    return res.status(200)
  } else {
    return res.status(500).send(questionH)
  }
}

const markAnswerHelpful = async (req, res) => {
  const answerH = await markingAnswerHelpful(req.params.answer_id)
  if (!answerH) {
    return res.status(200)
  } else {
    return res.status(500).send(answerH)
  }
}

const reportQuestion = async (req, res) => {
  const reportQ = await reportingQuestion(req.params.question_id)
  if (!reportQ) {
    return res.status(200)
  } else {
    return res.status(500).send(reportQ)
  }
}

const reportAnswer = async (req, res) => {
  const reportA = await reportingAnswer(req.params.answer_id)
  if (!reportA) {
    return res.status(200)
  } else {
    return res.status(500).send(reportA)
  }
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