
const express = require('express')
const tollService  = require('./services/tollService')
const chargeVehicleService  = require('./services/chargeVehicleService')
const app = express()
const port = 3000;
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : false}))


app.post('/drpapi/set-toll', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.setToll();
})

app.get('/drpapi/get-toll/:loc/:time', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.getToll();
})


app.get('/drpapi/get-tolls', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.getTolls();
})

app.post('/drpapi/delete-tolls', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.deleteTolls();
})

app.post('/drpapi/charge-vehicle', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.chargeVehicle();
})


app.get('/api/foo', function(req, res) {
  res.send({ok: 'ok!!'});
})


app.listen(port, "172.31.28.156", function () {
  console.log(`Grocery Web app service listening on port ${port}!`)
})
