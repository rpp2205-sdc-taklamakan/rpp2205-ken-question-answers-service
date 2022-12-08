const {masterInfo} = require('./models.js')

const masterInfoControl = (req, res) => {
  let info = req || 77107
  console.log('inside controller')
  masterInfo(info)
  .then((data) => {
    return res.send(data)
  })
  .catch((err) => {
    if (err) {
      res.status(500).send(console.log(err, 'error in masterInfoControl'))
    }
  })
}

module.exports = {
  masterInfoControl
}