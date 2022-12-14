// const express = require('express');
// const app = express();
const port = 3001;
// const path = require('path');
require('dotenv').config();
const path = require('path');
const axios = require('axios');
const express = require('express');
const compression = require('compression');
const Promise = require("bluebird");
const cloudinary = require("cloudinary").v2;
const pgp = require('pg-promise')();
const db = pgp('postgres://kenkurita:@localhost:5432/questionanswer')

const app = express();
app.use(compression());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true, limit: '50mb'}));

app.use(express.static(path.join(__dirname, '../client/dist')));
const headers = {headers: {authorization: process.env.TOKEN}};
const root = 'http://app-hrsei-api.herokuapp.com/api/fec2/hr-rpp'
const service = 'localhost:3001'

// get all products
app.get('/products', async (req, res) => {
  let url = `${root}/products?count=20`;
  const products = await axios.get(url, headers);
  res.status(200).json(products.data);
  axios.get(url, headers)
    .then((products) => {
      res.status(200).json(products.data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).send(err);
    })
})


app.get('/', (req, res) => {
  res.send('')
});


app.get(`/qa/questions/:product_id`, (req, res) => {
  console.log('here')
  axios.get(url, headers)
  .then((response) => {
    res.status(200).json(response.data)
  })
  .catch((err) => console.error(err))
})

// get answers
app.get('/qa/questions/:question_id/answers', (req, res) => {
  let url = `${root}/qa/questions/${req.params.question_id}/answers?count=50`;
  axios.get(url, headers)
  .then((response) => res.status(200).json(response.data))
  .catch((err) => console.error(err))
})

// post a question
app.post('/qa/questions', (req, res) => {
  let url = `${root}/qa/questions`;
  axios.post(url, req.body, headers)
  .then((response) => {
    console.log('Success Creating Question');
    console.log('Response', response);
    res.status(201).json(response.data)
  })
  .catch((err) => { console.error(err) })
})

// post an answer
app.post('/qa/questions/:question_id/answers', (req, res) => {
  let url = `${root}/qa/questions/${req.params.question_id}/answers`;
  axios.post(url, req.body, headers)
  .then((response) => {
    console.log('Success Creating Answer');
    res.status(201).json(response.data)
  })
  .catch((err) => { console.error(err) })
})

// mark question helpful
app.put('/qa/questions/:question_id/helpful', (req, res) => {
  let url = `${root}/qa/questions/${req.params.question_id}/helpful`;
  axios.put(url, {}, headers)
  .then((response) => res.status(204).json(response.data))
  .catch((err) => console.error(err))
})

// mark answer helpful
app.put('/qa/answers/:answer_id/helpful', (req, res) => {
  let url = `${root}/qa/answers/${req.params.answer_id}/helpful`;
  axios.put(url, {}, headers)
  .then((response) => res.status(204).json(response.data))
  .catch((err) => console.error(err))
})

//report question
app.put('/qa/questions/:question_id/report', (req, res) => {
  let url = `${root}/qa/questions/${req.params.question_id}/helpful`;
  axios.put(url, {}, headers)
  .then((response) => res.status(204).json(response.data))
  .catch((err) => console.error(err))
})

// report answer
app.put('/qa/answers/:answer_id/report', (req, res) => {
  let url = `${root}/qa/answers/${req.params.answer_id}/report`;
  axios.put(url, {}, headers)
  .then((response) => res.status(204).json(response.data))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  })
})

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

// send interactions detail to API
app.post('/interactions', (req, res) => {
  let url = `${root}/interactions`;
  const {element, widget, time} = req.body;
  console.log('interactions====> ', req.body);
  return axios.post(url, {element, widget, time}, headers)
    .then((result) => {
      console.log('interactions message: ', result.statusText);
      res.status(result.status).json('just created')
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    })
})

app.get('/:productId', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, '../client/dist') }, (err) => {
    if(err) {
      res.status(500).json(err);
    } else {
      console.log('Chang id');
    }
  })

})
let PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Listening at Port: ${PORT}`));