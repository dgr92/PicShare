const getDB = require("../database/db");
const jwt = require("jsonwebtoken");

const isUser = async (req, res, next) => {
  try {
    const connect = await getDB();
    const authorization = req.headers["authorization"];

    if (!authorization) {
      return res.status(401).send({
        status: 401,
        message: "Falta header de autorizacion:  authorization",
      });
    }

    let tokenInfo;

    try {
      tokenInfo = jwt.verify(authorization, process.env.SECRET_TOKEN);
    } catch (error) {
      return res.status(401).send({ status: 401, message: "Token no válido" });
    }

    // Comprobar que la fecha del token sea válida respecto a lastAuthUpdate
    const [user] = await connect.query(
      `SELECT lastAuthUpdate
             FROM users
             WHERE id = ?`,
      [tokenInfo.id]
    );

    const lastAuthUpdate = new Date(user[0].lastAuthUpdate);
    const timeStampCreateToken = new Date(tokenInfo.iat * 1000);

    if (timeStampCreateToken < lastAuthUpdate) {
      return res.status(401).send({
        status: "401: Token caducado",
        message: "Inicia sesión para continuar-----------",
      });
    }

    connect.release();

    // Añadimos la info del token a la request
    req.userInfo = tokenInfo;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isUser;
