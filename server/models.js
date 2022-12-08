const pgp = require('pg-promise')();
const bodyParser = require("body-parser");
const db = pgp('postgres://kenkurita:@localhost:5432/questionanswer')

let current = null;

const gettingQuestion = function(input) {
  let outsideObj = {};

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
      this.id= id;
      this.body = body;
      this.date = date;
      this.name = name;
      this.email = email;
      this.reported = reported;
      this.helpfulness = helpfulness;
      this.photos = photos;
    }
  }
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
            newAnswers.id= item.idanswer;
            newAnswers.body = item.body;
            newAnswers.date = item.date;
            newAnswers.name = item.answerername;
            newAnswers.email = item.answereremail;
            newAnswers.reported = item.reported;
            newAnswers.helpfulness = item.helpfulness;
            newAnswers.photos = [];
            resultAnswers.push(newAnswers)
          })
          q.answers = resultAnswers;
          resultAnswers.forEach((ph) => {
            return db.query(`SELECT * from answerPhotos where answerId=${ph.id};`)
              .then((data2) => {
                newAnswers = data2;
                current = prod;
                return prod
              })
              .catch((error) => {
                console.log(error, 'error inside answerPhotos masterInfo')
                res.status(404).send(error)
              })
          })
        })
        .catch((error) => {
          console.log(error, 'error inside Answers masterInfo')
          res.status(404).send(error)
        })
  })
    })
  .catch((error) => {
    console.log(error, 'error inside Answers masterInfo')
    res.status(404).send(error)
  })
}

module.exports = {
  gettingQuestion
}