const {gettingQuestion} = require('./models.js')
const bodyParser = require("body-parser");

const currentData = {};


const getQuestion = (req, res) => {
  // console.log('req,res', req.params)
  gettingQuestion(req.params.product_id)
  .then((data) => {
    //console.log(data,' inside controller masterInfoControl')
    res.status(200).json(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in masterInfoControl'))
    }
  })
}

module.exports = {
  getQuestion
}