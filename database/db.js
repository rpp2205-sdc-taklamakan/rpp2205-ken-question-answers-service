const Client = require('pg').Client

const client = new Client({
  HOST: "localhost",
  USER: "postgres",
  port: 5432,
  PASSWORD: "",
  DATABASE: "questionAnswer",
})

client.connect();

client.on(`error`, (err, res) => {
  if (err) {
    console.log(err, 'error message in database connection')
  }
  client.end;
})

module.exports = { client };