const { response } = require('express');
var express = require('express');
var router = express.Router();
const Products = require("../models").Products;
const User = require("../models").User;
const isAuth = require("../middleware/isAuth")
const poolController = require("../plugins/poolController")



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

router.get('/configuration', isAuth, function(req, res, next) {
  res.send('Estas en configuration');
});

module.exports = router;
