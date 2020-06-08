
const express = require('express');
const initService  = require('./services/initService');
const tollService  = require('./services/tollService');
const chargeVehicleService  = require('./services/chargeVehicleService');
//const accountSummaryService = require('./services/accountSummaryService');
// CSRF protection
//const cookieParser = require('cookie-parser');
//const csrf = require('csurf');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false}));


// CSRF protection
//app.use(cookieParser());
//app.use(csrf({cookie: true}));


// @see  https://github.com/bdunklau/drp-aws/wiki/API-drpapi-set-toll
app.post('/drpapi/set-toll', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.setToll();
})

// for test support
app.get('/drpapi/get-toll-count', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.getTollCount();
})


// get the toll at a time (millisec timestamp)
// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-get-toll#drpapiget-tollcitylocationtime
app.get('/drpapi/get-toll/:city/:location/:time', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.getToll();
})

// get the toll at this city, location and time range
// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-get-toll#drpapiget-tollcitylocationtimetime2
app.get('/drpapi/get-toll/:city/:location/:time/:time2', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.getToll();
})

/************ don't support returning the whole collection
app.get('/drpapi/get-tolls', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.getTolls();
})
************/


app.get('/drpapi/get-tolls', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.getTollsByQueryParms();
})


// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-get-tolls#drpapiget-tollscity
app.get('/drpapi/get-tolls/:city', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.getTolls();
})



// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-get-tolls#drpapiget-tollscitylocation
app.get('/drpapi/get-tolls/:city/:location', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.getTolls();
})


// @see   https://github.com/bdunklau/drp-aws/wiki/API--drpapi-delete-tolls
app.post('/drpapi/delete-tolls', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  tollServiceObj.deleteTolls();
})


// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-charge-vehicle
app.post('/drpapi/charge-vehicle', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.chargeVehicle();
})


// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-get-vehicle-charges
app.get('/drpapi/get-vehicle-charges/:plate', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getVehicleChargesByPlate();
})


// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-get-vehicle-charges
app.get('/drpapi/get-vehicle-charges/:plate/:city', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getVehicleChargesByPlateAndCity();
})


// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-get-vehicle-charges
app.get('/drpapi/get-vehicle-charges/:plate/since/:date1', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getVehicleChargesByPlateSinceDate();
})


// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-get-vehicle-charges
app.get('/drpapi/get-vehicle-charges/:plate/until/:date2', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getVehicleChargesByPlateUntilDate();
})


// @see  https://github.com/bdunklau/drp-aws/wiki/API--drpapi-get-vehicle-charges
app.get('/drpapi/get-vehicle-charges/:plate/range/:date1/:date2', function (req, res) {
  let tollServiceObj = new tollService(req, res);
  let chargeVehicleServiceObj = new chargeVehicleService(req, res, tollServiceObj);
  chargeVehicleServiceObj.getVehicleChargesByPlateBetweenTwoDates();
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

app.get('/drpapi/temp-time/:timestamp', function (req, res) {
  let initServiceObj = new initService(req, res);
  initServiceObj.getTime();
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
  console.log(`DRP Web app service listening on port ${port}!`)
})
