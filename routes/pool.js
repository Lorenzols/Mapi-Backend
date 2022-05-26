var express = require('express');
var router = express.Router();
const Products = require("../models").Products;
const User = require("../models").User;
const isAuth = require("../middleware/isAuth")



/* GET users listing. */
router.get('/', isAuth, function(req, res, next) {
  res.send({id: req.userId});
  console.log("dentro")
});

router.get('/analysis/', isAuth, async function(req, res, next) {
  const r = await Products.findAll({where: {fk_iduser: req.userId}})

  console.log("resultados:", r)

  res.send(r)
});

router.post('/analysis', isAuth, async function(req, res, next) {
  const resultProducts = await Products.create({name: req.body.name, appropriate_value: req.body.value, fk_iduser: req.body.user_id})
  console.log("PRODUCTOS: ", resultProducts)
  res.json({ph: 6, cl: 1})
});

router.get('/weather', isAuth, function(req, res, next) {
  res.send('Estas en weather');
});

router.get('/treatment', isAuth, function(req, res, next) {
  res.send('Estas en treatment');
});

router.get('/filtering', isAuth, function(req, res, next) {
  res.send('Estas en filtering');
});

router.get('/history', isAuth, function(req, res, next) {
  res.send('Estas en history');
});

router.get('/configuration', isAuth, function(req, res, next) {
  res.send('Estas en configuration');
});

module.exports = router;
