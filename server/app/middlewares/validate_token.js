const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
  const authorization = req.headers['authorization'];
  const token = authorization && authorization.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log(payload);
  } catch (err) {
    return res.sendStatus(401);
  }

  next();
}

module.exports = {
  validateToken
}