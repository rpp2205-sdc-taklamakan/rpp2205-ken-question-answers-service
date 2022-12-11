const pgp = require('pg-promise')();
const bodyParser = require("body-parser");
const db = pgp('postgres://kenkurita:@localhost:5432/questionanswer')


let current = null;
class ProductData {
  constructor (id, questions){
    this.id = id;
    this.questions = questions;
  }
}

class QuestionData {
  constructor (id, body, date, name, helpfulness, reported, answers) {
    this.id = id;
    this.body = body;
    this.date = date;
    this.name = name;
    this.helpfulness = helpfulness;
    this.reported = reported;
    this.answers = answers;
  }
};

class AnswerData {
  constructor (id, body, date, name, email, reported, helpfulness, photos){
    this.answer_id= id;
    this.body = body;
    this.date = date;
    this.answerer_name = name;
    this.email = email;
    this.reported = reported;
    this.helpfulness = helpfulness;
    this.photos = photos;
  }
}

const gettingQuestion = function(input) {

  let prod = new ProductData;
  prod.id = input;

  return db.query(`
  SELECT
  json_build_object(
    'question_id', Question.idQuestion, 'question_body', Question.body, 'question_date', Question.date, 'asker_name', Question.askerName,
    'question_helpfulness', Question.helpfulness, 'reported', Question.reported, 'answers', Answers
  ) results
  FROM Question
  LEFT JOIN (
    SELECT questionId,
    json_agg(
      json_build_object(
        'id', Answers.idAnswer, 'body', Answers.body, 'date', Answers.date, 'answerer_name', Answers.answererName,
        'helpfulness', Answers.helpfulness, 'questionId', Answers.questionId, 'photos', answerPhotos
      )
    ) answer
    FROM Answers
    LEFT JOIN (
      SELECT answerId,
      json_agg(
        json_build_object(
          'url', answerPhotos.url
        )
      ) photos
      FROM answerPhotos
      GROUP BY answerId
    ) answerPhotos on Answers.idAnswer = answerPhotos.answerId
    GROUP BY questionId
  ) Answers on Question.idQuestion = Answers.questionId
  WHERE questionId=${input}
  `)
  .then((data) => {
    return data
    })
  .catch((error) => {
    console.log(error, 'error inside Answers masterInfo')
  })
}


const gettingAnswer = function(id,count) {
  return db.query(`SELECT * from ANSWERS where questionId=${id} LIMIT ${count}`)
  .then((data) => {
    let result = {
      question: id,
      page: 1,
      count: String(count),
      results: null
    }
    let resultAnswers = [];
    data.forEach((item) => {
      let newAnswers = new AnswerData;
      newAnswers.answer_id= item.idanswer;
      newAnswers.body = item.body;
      newAnswers.date = item.date;
      newAnswers.answerer_name = item.answerername;
      newAnswers.email = item.answereremail;
      newAnswers.reported = item.reported;
      newAnswers.helpfulness = item.helpfulness;
      newAnswers.photos = [];
      resultAnswers.push(newAnswers)
    })
    result.results = resultAnswers;
    result.results.forEach((item) => {
      return db.query(`SELECT * from answerPhotos where answerId=${item.answer_id}`)
      .then((ph) => {
        item.photos = ph;
      })
    })
    // console.log(result)
    return result
  })
  .catch((error) => {
    console.log(error, 'error inside gettingAnswer')
    res.status(404).send(error)
  })
}

const postingQuestion = async function(data) {
  console.log(data)
  const res = await db.query(`INSERT INTO question (body, date, askerName, askerEmail, reported, helpfulness, productId)
  values ('hohoho1', 'string', 'exampleName', 'e@gmail', 1, 2, 88777)`)

  return res
}

const postingAnswer = function(data) {
  let obj = {
    body: req.data.body,
    date: req.data.date,
    answererName: req.data.answererName,
    answererEmail: req.data.answerEmail,
    reported: req.data.reported,
    helpfulness: req.data.helpfulness,
    questionId: req.data.questionId,
    }
  db.query(`INSERT INTO answers (body, date, answererName, answererEmail, reported, helpfulness, questionId) values('${data.body}','${data.date}', '${data.answererName}', '${data.answererEmail}', ${data.reported}, ${data.helpfulness}, ${data.questionId}})`)
  .then((data) => {
    return console.log('successfully posted to database')
  })
  .catch((error) => {
    console.log(error, 'error inside postingAnswer')
    res.status(404).send(error)
  })
}

const markingQuestionHelpful = function (input) {
  db.query(`UPDATE question SET helpfulness += 1 WHERE questionId=${input}`)
  .then((data) => {
    return console.log(`successfully incremented helpfulness for ${input}`)
  })
  .catch((error) => {
    console.log(error, 'error inside markingQuestionHelpful')
    res.status(404).send(error)
  })
}

const markingAnswerHelpful = function(input) {
  db.query(`UPDATE answers SET helpfulness += 1 WHERE answerId=${input}`)
  .then((data) => {
    return console.log(`successfully incremented helpfulness for ${input}`)
  })
  .catch((error) => {
    console.log(error, 'error inside markingQuestionHelpful')
    res.status(404).send(error)
  })
}

const reportingQuestion = function(input) {
  db.query(`UPDATE question SET reported += 1 WHERE questionId=${input}`)
  .then((data) => {
    return console.log(`successfully incremented reported for ${input}`)
  })
  .catch((error) => {
    console.log(error, 'error inside markingQuestionHelpful')
    res.status(404).send(error)
  })
}

const reportingAnswer = function(input) {
  db.query(`UPDATE answers SET reported += 1 WHERE answerId=${input}`)
  .then((data) => {
    return console.log(`successfully incremented reported for ${input}`)
  })
  .catch((error) => {
    console.log(error, 'error inside markingQuestionHelpful')
    res.status(404).send(error)
  })
}

module.exports = {
  gettingQuestion,
  gettingAnswer,
  postingQuestion,
  postingAnswer,
  markingQuestionHelpful,
  markingAnswerHelpful,
  reportingQuestion,
  reportingAnswer
}