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

const gettingQuestion = async function(input, count) {
  const gettingQ = await db.query(`
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
  WHERE productId=${input} LIMIT ${count}
  `)
  return gettingQ
}


const gettingAnswer = function(questionId) {
  return db.query(`
  SELECT json_build_object(
    'answer_id', Answers.idAnswer, 'body', Answers.body, 'date', Answers.date, 'answerer_name', Answers.answererName, 'helpfulness', Answers.helpfulness
  ) results
  FROM ANSWERS
  WHERE questionId=${questionId}
  `)
  .then((data) => {
    // add line: 'photos', answerPhotos :::: to select object
    /////////////////////////
    // help. need to be able to do a left join for photos.
    // LEFT JOIN (
    //   SELECT answerId,
    //   json_agg(
    //     json_build_object(
    //       'id', idPhoto, 'url', answersPhoto.url
    //     )
    //   ) photos
    //   FROM answerPhotos
    //   GROUP BY answerId
    //   answerPhotos on Answer.idAnswer = answerPhotos.answerId
    // ) answerPhotos on Answer.idAnswer = answerPhotos.answerId
    return data
  })
  .catch((error) => {
    console.log(error, 'error inside gettingAnswer')
  })
}

const postingQuestion = async function(data) {
  console.log(data)
  const res = await db.query(`INSERT INTO question (body, date, askerName, askerEmail, reported, helpfulness, productId)
  values ('${data.body}', '${data.date}', '${data.askerName}', '${data.askerEmail}', ${data.reported}, ${data.helpfulness}, ${data.productId})`)
  return res
}

const postingAnswer = async function(data) {
  console.log(data, 'inside postingAnswer')
  const res = await db.query(`INSERT INTO answers (body, date, answererName, answererEmail, reported, helpfulness, questionId)
  values('${data.body}','${data.date}', '${data.answererName}', '${data.answererEmail}', ${data.reported}, ${data.helpfulness}, ${data.questionId})`)
  return res
}

const markingQuestionHelpful = async function (input) {
  const res = await db.query(`UPDATE Question SET helpfulness = helpfulness + 1 WHERE idQuestion=${input}`)
  return res
}

const markingAnswerHelpful = async function(input) {
  const res = await db.query(`UPDATE answers SET helpfulness = helpfulness + 1 WHERE idAnswer=${input}`)
  return res
}

const reportingQuestion = async function(input) {
  const res = await db.query(`UPDATE question SET reported = reported + 1 WHERE idQuestion=${input}`)
  return res
}

const reportingAnswer = async function(input) {
  const res = db.query(`UPDATE answers SET reported = reported + 1 WHERE idAnswer=${input}`)
  return res
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