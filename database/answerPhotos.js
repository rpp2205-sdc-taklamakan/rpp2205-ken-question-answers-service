const Pool = require('pg').Pool
const fs = require("fs");
const fastcsv = require("fast-csv");
// const db = require("./db.config.js");

let stream = fs.createReadStream("../../answers_photos.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();
    console.log('here one //////////////')
    // connect to the PostgreSQL database
    const pool = new Pool({
      host: "localhost",
      user: "kenkurita",
      port: 5432,
      password: "",
      database: "questionanswer",
    })
   pool.connect((err, client, release) => {
    if (err) {
      return console.error('Error acquiring client', err.stack)
    }
     for (var i = 1; i < csvData.length; i++) {
      // console.log(Number(csvData[0][1]), JSON.stringify(csvData[0][2]), 'hello world')
      client.query(`INSERT into answerPhotos(idPhoto, url, answerId) values(${csvData[i][0]},'${csvData[i][2]}', ${Number(csvData[i][1])} )`, (err, res) => {
        if (err) {
          console.log(err, 'error message in client query database')
        } else {
          console.log(`successfully posted values to database)`)
        }
      })
     }
  });
  });


stream.pipe(csvStream);