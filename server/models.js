const pgp = require('pg-promise')();
const db = pgp('postgres://kenkurita:@localhost:5432/questionanswer')


const masterInfo = function(input) {

  let newData = {
    product_id: input,
    results: []
  }

  let resultData = {
    question_id: null,
    question_body: null,
    question_date: null,
    asker_name: null,
    question_helpfulness: null,
    reported: null,
    answers: null
  };

  let resultAnswers = {
    id: null,
    body: null,
    date: null,
    answerer_name: null,
    answerer_email: null,
    helpfulness: null,
    photos:[]
  }

  db.query(`SELECT * from Question where productId=${input};`)
  .then((data) => {
    resultData.question_id = data[0].idquestion;
    resultData.question_body = data[0].body;
    resultData.question_date = data[0].date;
    resultData.asker_name = data[0].askername;
    resultData.question_helpfulness = data[0].helpfulness;
    resultData.reported = data[0].reported;
    resultData.answers = {};
    newData.results.push(resultData);
  })
    db.query(`SELECT * from Answers where questionId=${resultData.question_id };`)
    .then((data1) => {
      console.log(data1, 'data1')
      resultAnswers.id = data1[0].idanswer;
      resultAnswers.body = data1[0].body;
      resultAnswers.date = data1[0].date;
      resultAnswers.answerer_name = data1[0].answerername;
      resultAnswers.answerer_email = data1[0].answereremail;
      resultAnswers.helpfulness = data1[0].helpfulness;
      resultData.answers = resultAnswers;
      db.query(`SELECT * from answerPhotos where answerId=${resultAnswers.id};`)
      .then((data2) => {
        console.log(resultAnswers, resultData, 'test Filimon' )
        console.log(data2, 'data2')
        resultAnswers.photos = data2
        outsideObj.newData = newData;
        outsideObj.resultData = resultData;
        outsideObj.resultAnswers = resultAnswers;
        res.status(200).json(outsideObj);
        return newData
      })
      .catch((error) => {
        console.log(error, 'error inside answerPhotos masterInfo')
        res.status(404).send(error)
      })
    })
    .catch((error) => {
      console.log(error, 'error inside Answers masterInfo')
      res.status(404).send(error)
    })
  .catch((error) => {
    console.log(error, 'error inside Answers masterInfo')
    res.status(404).send(error)
  })
}

module.exports = {
  masterInfo
}
