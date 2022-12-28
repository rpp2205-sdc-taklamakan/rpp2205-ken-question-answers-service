const {gettingQuestion, gettingAnswer, postingQuestion, postingAnswer, markingQuestionHelpful, markingAnswerHelpful, reportingQuestion, reportingAnswer} = require('./models.js')
const bodyParser = require("body-parser");

const currentData = {};


const getQuestion = async (req, res) => {
  // console.log('req,res', req.params)
  // console.log(req.params)
  const getQ = await gettingQuestion(req.query.product_id, req.query.count)
  if (getQ) {
    let obj = {
      product_id: req.query.product_id,
      results: getQ
    }
    res.status(200).json(obj)
  } else {
    res.status(500).send(getQ)
  }
}

const getAnswer = async (req, res) => {
  const getA = await gettingAnswer(req.params.question_id)
  if (getA) {
    let obj = {
      question: req.params.question_id,
      page: 0,
      count: 0,
      results: []
    }
    obj.results = getA;
    obj.count = obj.results.length;
    res.status(200).json(obj)
  } else {
    res.status(500).send(getA)
  }
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