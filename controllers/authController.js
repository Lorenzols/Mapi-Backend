const bcrypt = require("bcryptjs");
const User = require("../models").User;
const jwt = require("jsonwebtoken");

exports.postSignin = async (req, res, next) => {
    console.log('user: ', User)
  const { firstName, email, password } = req.body;
  console.log("email: ", email)
  try {
    const exsitUser = await User.findOne({where: { email: 'lorenzo2@gmail.com' }});
    console.log("existe:", exsitUser)
    if (exsitUser) {
      const error = new Error(
        "Eamil already exist, please pick another email!"
      );
      res.status(409).json({
        error: "Eamil already exist, please pick another email! ",
      });
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // const user = new userModel({
    //   firstName: firstName,
    //   email: email,
    //   password: hashedPassword,
    // });
    // const result = await user.save();

    const result = await User.create({firstName: firstName, mail: email, password: hashedPassword})

    res.status(200).json({
      message: "User created",
      user: { id: result._id, email: result.email },
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
      const error = new Error("user with this email not found!");
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;

    const comparePassword = bcrypt.compare(password, user.password);

    if (!comparePassword) {
      const error = new Error("password is not match!");
      error.statusCode = 401;
      throw error;
    }
    const token = jwt.sign({ email: loadedUser.email }, "expressnuxtsecret", {
      expiresIn: "20m", // it will expire token after 20 minutes and if the user then refresh the page will log out
    });
    res.status(200).json({ token: token });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getUser = (req, res, next) => { // this function will send user data to the front-end as I said above authFetch on the user object in nuxt.config.js will send a request and it will execute
  res.status(200).json({
    user: {
      id: loadedUser._id,
      fullname: loadedUser.fullname,
      email: loadedUser.email,
    },
  });
};