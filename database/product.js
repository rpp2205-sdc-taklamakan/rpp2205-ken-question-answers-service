const Pool = require('pg').Pool
const fs = require("fs");
const fastcsv = require("fast-csv");
// const db = require("./db.config.js");

let stream = fs.createReadStream("../../product.csv");
let csvData = [];
let csvStream = fastcsv
  .parse()
  .on("data", function(data) {
    csvData.push(data);
  })
  .on("end", function() {
    // remove the first line: header
    csvData.shift();
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

     for (var i = 0; i < csvData.length; i++) {
      client.query(`INSERT into productId(id, productName, slogan, productDescription,
        category, defaultPrice) values(${Number(csvData[i][0])},'${csvData[i][1]}', '${csvData[i][2]}', '${csvData[i][3]}',
        '${csvData[i][4]}', ${Number(csvData[i][5])})`, (err, res) => {
        if (err) {
          console.log(err, 'error message in client query database')
        } else {
          console.log(`successfully posted values to database`, i)
        }
      })
     }
  });
  });


stream.pipe(csvStream);