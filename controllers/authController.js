const bcrypt = require("bcryptjs");
const User = require("../models").User;
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
      expiresIn: "20m",
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