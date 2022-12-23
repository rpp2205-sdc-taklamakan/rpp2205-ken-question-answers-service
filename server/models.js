const pgp = require('pg-promise')();
const bodyParser = require("body-parser");
const db = pgp('postgres://kenkurita:@localhost:5432/questionanswer')

const gettingQuestion = async function(input, count) {
  const gettingQ = await db.query(`
  SELECT
  json_build_object(
    'question_id', Question.idQuestion, 'question_body', Question.body, 'question_date', Question.date, 'asker_name', Question.askerName,
    'question_helpfulness', Question.helpfulness, 'reported', Question.reported, 'answers', Answers
  ) results
  FROM Question
  RIGHT JOIN (
    SELECT questionId,
    json_agg(
      json_build_object(
        'id', Answers.idAnswer, 'body', Answers.body, 'date', Answers.date, 'answerer_name', Answers.answererName,
        'helpfulness', Answers.helpfulness, 'questionId', Answers.questionId, 'photos', answerPhotos
      )
    ) answer
    FROM Answers
    RIGHT JOIN (
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
  WHERE productId=${input}
  LIMIT ${count}
  `)
  return gettingQ
}
// LIMIT ${count} OFFSET ${(page - 1) * count}

const gettingAnswer = async function(questionId) {
  const getA = await db.query(`
  SELECT json_build_object(
    'answer_id', Answers.idAnswer, 'body', Answers.body, 'date', Answers.date, 'answerer_name', Answers.answererName,
    'helpfulness', Answers.helpfulness, 'photos', answerPhotos
  ) results
  FROM ANSWERS
  RIGHT JOIN (
    SELECT answerId,
    json_agg(
      json_build_object(
        'url', answerPhotos.url, 'id', answerPhotos.idPhoto
      )
    )photos
    FROM answerPhotos
    GROUP BY answerId
  ) answerPhotos on Answers.idAnswer = answerPhotos.answerId
  WHERE questionId=${questionId}
  `)
  return getA
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