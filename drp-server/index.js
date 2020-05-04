
const express = require('express');
const initService  = require('./services/initService');
const tollService  = require('./services/tollService');
const chargeVehicleService  = require('./services/chargeVehicleService');
//const accountSummaryService = require('./services/accountSummaryService');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));


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

app.get('/drpapi/get-vehicle-charges/:plate', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getVehicleCharges();
})

app.get('/drpapi/get-vehicle-charges/:plate/since/:date1', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getVehicleCharges();
})

app.get('/drpapi/get-vehicle-charges/:plate/until/:date2', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getVehicleCharges();
})

app.get('/drpapi/get-vehicle-charges/:plate/range/:date1/:date2', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getVehicleCharges();
})

app.post('/drpapi/delete-vehicle-charges', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.deleteVehicleCharges();
})

app.get('/drpapi/get-account-summary/:plate', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getAccountSummary();
})

app.get('/drpapi/temp-acc/:plate', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.tempAcc();
})

app.get('/drpapi/temp-get', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.tempGet();
})

app.get('/drpapi/temp-delete', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.tempDelete();
})

app.get('/drpapi/temp-init', function (req, res) {
  let initServiceObj = new initService(req, res);
  initServiceObj.init();
})

app.get('/drpapi/temp-insert/:plate/:balance', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.tempInsert();
})

app.get('/api/foo', function(req, res) {
  res.send({ok: 'ok!!'});
})


app.listen(port, "172.31.28.156", function () {
  console.log(`Grocery Web app service listening on port ${port}!`)
})
