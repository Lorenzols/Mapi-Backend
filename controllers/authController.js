const bcrypt = require("bcryptjs");
const User = require("../models").User;
const Products = require("../models").Products;
const jwt = require("jsonwebtoken");
const Configuration = require("../models").configuration;
const Filtering = require("../models").filtering;
const Days_filtering = require("../models").days_filtering;

exports.postSignin = async (req, res, next) => {

  const { firstName, email, password } = req.body

  try {
    const exsitUser = await User.findOne({where: { email: email }})

    if (exsitUser) {
      res.send({isEmail: true})
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({firstName: firstName, email: email, password: hashedPassword})

    //Valores por defecto en este caso solo quiero estos dos productos
    const pH = await Products.create({name: "pH+", appropriate_value: 7.2, dosage_recommend_ml: 300, dosage_recommend_mc: 50, fk_iduser: result.id, deposit: 0})
    const ppm = await Products.create({name: "ppm", appropriate_value: 1.5, dosage_recommend_ml: 25, dosage_recommend_mc: 1, fk_iduser: result.id, deposit: 0})

    //valores por defecto de la configuración
    const config = await Configuration.create({pool_location_latitud: 0, pool_location_longitud: 0, filtering_auto: false, treatment_auto: false, meters_cubics_pool: 0, initial_treatment_time: '2022-01-01T24:00:00.000Z', fk_iduser: result.id})

    //VAlores por defecto filtrado
    const filter = await Filtering.create({time_on: '2022-01-01T01:00:00.000Z',time_off: '2022-01-01T06:00:00.000Z',fk_iduser: result.id})

    // Valores por defecto dias de filtrado
    const filterData = await Filtering.findAll({where: {fk_iduser: result.id}})
    const daysFilter = await Days_filtering.create({monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false, sunday: false, fk_idfiltering: filterData[0].dataValues.id})

    res.status(200).json({
      message: "Usuario creado",
      user: { id: result.id, email: result.email },
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

let loadedUser;
exports.postLogin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({where: { email: email }});

    if (!user) {
      res.send({error: 'El email o la contraseña no son correctos.'})
    }

    loadedUser = user;
    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      // 401
      res.send({error: 'El email o la contraseña no son correctos.'})
    }
    const token = jwt.sign({ email: loadedUser.email }, "elsecretoesmapiok", {
      expiresIn: "1h",
    });
    res.status(200).json({ token: token })
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = (req, res, next) => {
  res.status(200).json({
    user: {
      id: loadedUser.id,
      firstName: loadedUser.firstName,
      email: loadedUser.email,
    },
  });
};