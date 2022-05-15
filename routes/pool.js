var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Estas en pool');

  console.log("dentro")
});

router.get('/analysis', function(req, res, next) {
  res.json({ph: 6, cl: 1})
});

router.get('/weather', function(req, res, next) {
  res.send('Estas en weather');
});

router.get('/treatment', function(req, res, next) {
  res.send('Estas en treatment');
});

router.get('/filtering', function(req, res, next) {
  res.send('Estas en filtering');
});

router.get('/history', function(req, res, next) {
  res.send('Estas en history');
});

router.get('/configuration', function(req, res, next) {
  res.send('Estas en configuration');
});

module.exports = router;
