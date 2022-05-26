const jwt = require("jsonwebtoken");
const User = require("../models").User;

module.exports = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    throw error;
  }
  console.log("HEADER: ", authHeader)
  const token = authHeader.split(" ")[1];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "elsecretoesmapiok");
    //Consulta para obtener el id del user que hace la petición
    const userData = await User.findOne({where: {email: decodedToken.email}})
    req.userId = userData.dataValues.id
  } catch (err) {
    err.statusCode = 500;
    throw err;
  }
  if (!decodedToken) {
    const error = new Error("No autenticado");
    error.statusCode = 401;
    throw error;
  }
  next();
};