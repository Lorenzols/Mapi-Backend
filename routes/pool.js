const { response } = require('express');
var express = require('express');
const { param } = require('express/lib/request');
var router = express.Router();
const Products = require("../models").Products;
const User = require("../models").User;
const isAuth = require("../middleware/isAuth")
const poolController = require("../plugins/poolController")
const Configuration = require("../models").configuration;




/* GET users listing. */
router.get('/', isAuth, function(req, res, next) {
  res.send({id: req.userId});
  console.log("dentro")
});

router.get('/analysis/', isAuth, async function(req, res, next) {

  // const r = await Products.findAll({where: {fk_iduser: req.userId}})
  // console.log("resultados:", r)
  
  let poolStatus = await poolController.productsStatus(req).then(response => {return response})

  res.send(poolStatus)
});

router.post('/analysis', isAuth, async function(req, res, next) {
  // const resultProducts = await Products.create({name: req.body.name, appropriate_value: req.body.value, fk_iduser: req.body.user_id})
  // console.log("PRODUCTOS: ", resultProducts)
  res.json({ph: 6, cl: 1})
});

router.get('/weather', isAuth, function(req, res, next) {
  res.send('Estas en weather');
});

router.get('/treatment', isAuth, async function(req, res, next) {

  let poolStatus = await poolController.productsStatus(req).then(response => {return response})

  let poolProducts = await Products.findAll( {where: {fk_iduser: req.userId}})

  console.log("VALORRRR: ", poolProducts)

  let data = {
    "poolStatus": poolStatus,
    "poolProducts": poolProducts
  }

  res.send(data);
});

router.patch('/treatment/time', isAuth, async function(req, res, next) {

  await Configuration.update({initial_treatment_time: `2022-01-01T${req.body.time}:00.000Z`}, {where: {fk_iduser: req.userId}})
  // console.log("VALORRRR: ", initial_treatment_time: '2022-01-01T24:00:00.000Z')
  console.log("VALORRRR: ", req.body.time)

  res.status().send(200)
});

router.patch('/treatment/ap', isAuth, async function(req, res, next) {

  //Se obtiene el valor adecuado
  let poolApOk = await Products.findAll({where: {fk_iduser: req.userId, name: req.body.producto}})
  let appropriate_value = poolApOk[0].dataValues.appropriate_value

  if(req.body.signo == 1){
    appropriate_value += 0.1
    console.log("AAA: ", appropriate_value)
    let poolAp = await Products.update({appropriate_value: appropriate_value}, {where: {fk_iduser: req.userId, name: req.body.producto}})
  }else{
    appropriate_value -= 0.1
    console.log("AAA: ", appropriate_value)
    let poolAp = await Products.update({appropriate_value: appropriate_value}, {where: {fk_iduser: req.userId, name: req.body.producto}})
  }

  let valueOk = await Products.findAll({where: {fk_iduser: req.userId, name: req.body.producto}})
  console.log("QQQQ: ", valueOk)
  res.send({"valueOk": valueOk});
});

router.get('/filtering', isAuth, function(req, res, next) {
  res.send('Estas en filtering');
});

router.get('/history', isAuth, function(req, res, next) {
  res.send('Estas en history');
});

router.get('/configuration', isAuth, async function(req, res, next) {
  let result = await Configuration.findAll({where: {fk_iduser: req.userId}})
  res.send({"configuration": result})
});

router.patch('/configuration/filtering', isAuth, async function(req, res, next) {
  await Configuration.update({filtering_auto: req.body.check}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/configuration/treatment', isAuth, async function(req, res, next) {
  await Configuration.update({treatment_auto: req.body.check}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/configuration/mc', isAuth, async function(req, res, next) {
  await Configuration.update({meters_cubics_pool: req.body.metersCubics}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/configuration/ms/:name/:ml/:mc', isAuth, async function(req, res, next) {
  await Products.update({dosage_recommend_ml: req.params.ml, dosage_recommend_mc: req.params.mc}, {where: {fk_iduser: req.userId, name :req.params.name}})
  console.log("EEEAEAKK: ", req.params.name)
  res.status().send(200)
});


router.patch('/configuration/latitud/:value', isAuth, async function(req, res, next) {
  await Configuration.update({pool_location_latitud: req.params.value}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/configuration/longitud/:value', isAuth, async function(req, res, next) {
  await Configuration.update({pool_location_longitud: req.params.value}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});


module.exports = router;
