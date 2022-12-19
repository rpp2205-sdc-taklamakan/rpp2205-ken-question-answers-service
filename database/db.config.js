const Client = require('pg').Client

const client = new Client({
  HOST: "localhost",
  USER: "postgres",
  port: 5432,
  PASSWORD: "",
  DATABASE: "questionAnswer",
})

client.connect();

client.query(`Select * from users`, (err, res) => {
  if (err) {
    console.log(err, 'error message in client query database')
  } else {
    console.log('successfully pulled from database', res)
  }
  client.end;
})

module.exports = { client };

