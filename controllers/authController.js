const bcrypt = require("bcryptjs");
const User = require("../models").User;
const Products = require("../models").Products;
const jwt = require("jsonwebtoken");

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
    const pH = await Products.create({name: "pH+", appropriate_value: 7.2, dosage_liters: 0.5, dosage_cubic_meters: 1, fk_iduser: result.id})
    const ppm = await Products.create({name: "ppm", appropriate_value: 1.5, dosage_liters: 0.3, dosage_cubic_meters: 50, fk_iduser: result.id})
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