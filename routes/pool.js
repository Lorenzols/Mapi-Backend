const { response } = require('express');
var express = require('express');
const { param } = require('express/lib/request');
var router = express.Router();
const Products = require("../models").Products;
const User = require("../models").User;
const isAuth = require("../middleware/isAuth")
const poolController = require("../plugins/poolController")
const Configuration = require("../models").configuration;
const Filtering = require("../models").filtering;
const Days_filtering = require("../models").days_filtering;
const Weather = require("../models").weather;
const axios = require("axios");


router.get('/analysis/', isAuth, async function(req, res, next) {
  //Se recogen los datos del plugin creado para calcular el estado de la piscina
  let poolStatus = await poolController.productsStatus(req).then(response => {return response})
  res.send(poolStatus)
});

router.get('/weather', isAuth, async function(req, res, next) {
  const tempAmbient = [34, 35, 36, 37, 38 ,39]
  const tempPool = [16, 17, 18, 19]
  const keyApi = "591fd86cbfc504a6385d497fad3f3347"

  function tRandom(list) {
    let a = Math.floor(Math.random() * list.length)
    return list[a]
  }

  //Se simulan los datos de la temperatura
  let tAmbient = tRandom(tempAmbient)
  let tPool = tRandom(tempPool)
  let api = {}

  //Se recogen la latitud y longitud de la BD
  let configt = await Configuration.findAll({where: {fk_iduser: req.userId}})
  let location = configt[0].dataValues

  let lat = location.pool_location_latitud
  let lon = location.pool_location_longitud

  //Se hace la peticion a la api del tiempo
  try{
    api = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&appid=${keyApi}&units=metric`)
    api = api.data
  
  }catch(err){
    api = false
  }
  
  res.send({"tAmbient": tAmbient, "tPool": tPool, "apiweather": api});
});

router.get('/treatment', isAuth, async function(req, res, next) {

  //se envia los datos del estado de la piscina y la información de los productos para recoger el valor pordefecto
  let poolStatus = await poolController.productsStatus(req).then(response => {return response})
  let poolProducts = await Products.findAll( {where: {fk_iduser: req.userId}})

  let data = {
    "poolStatus": poolStatus,
    "poolProducts": poolProducts
  }

  res.send(data);
});

router.patch('/treatment/time', isAuth, async function(req, res, next) {

  //Se cambia la hora de hacer el tratamiento
  await Configuration.update({initial_treatment_time: `2022-01-01T${req.body.time}:00.000Z`}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/treatment/ap', isAuth, async function(req, res, next) {

  //Se obtiene el valor adecuado
  let poolApOk = await Products.findAll({where: {fk_iduser: req.userId, name: req.body.producto}})
  let appropriate_value = poolApOk[0].dataValues.appropriate_value

  //Se comprueba si se tiene que sumar o restar con el (1 = sumar, 0 = restar)
  if(req.body.signo == 1){
    appropriate_value += 0.1
    let poolAp = await Products.update({appropriate_value: appropriate_value}, {where: {fk_iduser: req.userId, name: req.body.producto}})
  }else{
    appropriate_value -= 0.1
    let poolAp = await Products.update({appropriate_value: appropriate_value}, {where: {fk_iduser: req.userId, name: req.body.producto}})
  }

  let valueOk = await Products.findAll({where: {fk_iduser: req.userId, name: req.body.producto}})
  res.send({"valueOk": valueOk});
});


router.get('/filtering', isAuth, async function(req, res, next) {
  //se recogen los datos de la BD del filtrado y se envian.
  const filter = await Filtering.findAll({where: {fk_iduser: req.userId}})
  res.send({"filter": filter})
});

router.patch('/filtering/on', isAuth, async function(req, res, next) {
  //Interructor del filtrado
  await Filtering.update({time_on: `2022-01-01T${req.body.time}:00.000Z`}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/filtering/off', isAuth, async function(req, res, next) {
  //Interructor del filtrado
  await Filtering.update({time_off: `2022-01-01T${req.body.time}:00.000Z`}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

//Peticiones para saber los dias de filtrado y modificarlos
router.get('/filtering/days', isAuth, async function(req, res, next) {

  const filterData = await Filtering.findAll({where: {fk_iduser: req.userId}})
  const days = await Days_filtering.findAll({where: {fk_idfiltering: filterData[0].dataValues.id}})
  res.send({"days": days})
});

router.patch('/filtering/days/monday/:value', isAuth, async function(req, res, next) {

  const filterData = await Filtering.findAll({where: {fk_iduser: req.userId}})
  await Days_filtering.update({monday: req.params.value}, {where: {fk_idfiltering: filterData[0].dataValues.id}})
  res.status().send(200)
});

router.patch('/filtering/days/tuesday/:value', isAuth, async function(req, res, next) {

  const filterData = await Filtering.findAll({where: {fk_iduser: req.userId}})
  await Days_filtering.update({tuesday: req.params.value}, {where: {fk_idfiltering: filterData[0].dataValues.id}})
  res.status().send(200)
});

router.patch('/filtering/days/wednesday/:value', isAuth, async function(req, res, next) {

  const filterData = await Filtering.findAll({where: {fk_iduser: req.userId}})
  await Days_filtering.update({wednesday: req.params.value}, {where: {fk_idfiltering: filterData[0].dataValues.id}})
  res.status().send(200)
});

router.patch('/filtering/days/thursday/:value', isAuth, async function(req, res, next) {

  const filterData = await Filtering.findAll({where: {fk_iduser: req.userId}})
  await Days_filtering.update({thursday: req.params.value}, {where: {fk_idfiltering: filterData[0].dataValues.id}})
  res.status().send(200)
});

router.patch('/filtering/days/friday/:value', isAuth, async function(req, res, next) {

  const filterData = await Filtering.findAll({where: {fk_iduser: req.userId}})
  await Days_filtering.update({friday: req.params.value}, {where: {fk_idfiltering: filterData[0].dataValues.id}})
  res.status().send(200)
});

router.patch('/filtering/days/saturday/:value', isAuth, async function(req, res, next) {

  const filterData = await Filtering.findAll({where: {fk_iduser: req.userId}})
  await Days_filtering.update({saturday: req.params.value}, {where: {fk_idfiltering: filterData[0].dataValues.id}})
  res.status().send(200)
});

router.patch('/filtering/days/sunday/:value', isAuth, async function(req, res, next) {

  const filterData = await Filtering.findAll({where: {fk_iduser: req.userId}})
  await Days_filtering.update({sunday: req.params.value}, {where: {fk_idfiltering: filterData[0].dataValues.id}})
  res.status().send(200)
});

router.get('/history', isAuth, function(req, res, next) {
  res.send('Estas en history');
});

router.get('/configuration', isAuth, async function(req, res, next) {
  //se recogen los datos de la bd de la condfiguración y se envian
  let result = await Configuration.findAll({where: {fk_iduser: req.userId}})
  res.send({"configuration": result})
});

router.patch('/configuration/filtering', isAuth, async function(req, res, next) {
  //Para cambiar el interructor de filtering
  await Configuration.update({filtering_auto: req.body.check}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/configuration/treatment', isAuth, async function(req, res, next) {
   //Para cambiar el interructor de treatment
  await Configuration.update({treatment_auto: req.body.check}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/configuration/mc', isAuth, async function(req, res, next) {
  //Se cambian los metros cubicos de la pisicina
  await Configuration.update({meters_cubics_pool: req.body.metersCubics}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/configuration/ms/:name/:ml/:mc', isAuth, async function(req, res, next) {
  //Se cambian los valores de mililitros y metros cubicos, que dependen de cada producto.
  await Products.update({dosage_recommend_ml: req.params.ml, dosage_recommend_mc: req.params.mc}, {where: {fk_iduser: req.userId, name :req.params.name}})
  res.status().send(200)
});


router.patch('/configuration/latitud/:value', isAuth, async function(req, res, next) {
  //Se cambia la latitud
  await Configuration.update({pool_location_latitud: req.params.value}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/configuration/longitud/:value', isAuth, async function(req, res, next) {
  //Se cambia la longitud
  await Configuration.update({pool_location_longitud: req.params.value}, {where: {fk_iduser: req.userId}})
  res.status().send(200)
});

router.patch('/user/:name', isAuth, async function(req, res, next) {
  //Se cambia el nombre del usuario
  await User.update({firstName: req.params.name}, {where: {id: req.userId}})
  res.status().send(200)
});


module.exports = router;
