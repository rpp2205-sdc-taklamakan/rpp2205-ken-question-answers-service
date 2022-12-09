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

  return db.query(`SELECT * from Question where productId=${prod.id};`)
  .then((data) => {
    //console.log(data, 'inside first select')

    let results = [];
    data.forEach((item) => {
      let newQuestion = new QuestionData;
      newQuestion.id = item.idquestion;
      newQuestion.body = item.body;
      newQuestion.date = item.date;
      newQuestion.name = item.name;
      newQuestion.helpfulness = item.helpfulness;
      newQuestion.reported = item.reported;
      newQuestion.answers = {};
      results.push(newQuestion)
    })
    prod.questions = results;

    ////////// looping through array of questions to assign answers ///////////////
    results.forEach((q) => {
      return db.query(`SELECT * from Answers where questionId=${q.id };`)
        .then((data1) => {
          let resultAnswers = [];
          data1.forEach((item) => {
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
          q.answers = resultAnswers;
          // console.log(resultAnswers)

          resultAnswers.forEach((ph) => {
            return db.query(`SELECT * from answerPhotos where answerId=${ph.answer_id};`)
            .then((data2) => {
              ph.photos = data2;
              console.log(prod,' inside')
              return prod;
            })
            return prod
            .catch((error) => {
              console.log(error, 'error inside answerPhotos getQuestion')
              res.status(404).send(error)
            })
          })
        })
        .catch((error) => {
          console.log(error, 'error inside Answers getQuestion')
          res.status(404).send(error)
        })
  })
    })
  .catch((error) => {
    console.log(error, 'error inside Answers masterInfo')
    res.status(404).send(error)
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

const postingQuestion = function(data) {
  db.query(`INSERT INTO question (body, date, askerName, askerEmail, reported, productId) values ('${data.body}', '${data.date}', '${data.askerName}', '${data.askerEmail}', ${data.reported}, ${data.helpfulness}, ${data.productId})`)
  .then((data) => {
    return console.log('successfully posted to database')
  })
  .catch((error) => {
    console.log(error, 'error inside postingQuestion')
    res.status(404).send(error)
  })
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