const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Database = require('../database');

/**
 * Authenticate the SA/agent.
 *
 * SAs (service accounts) are non-human users meant for automation or
 * unattended operations.
 * 
 * Header Parameters
 * 
 * authorization
 * 
 * Request Body:
 * 
 * user_id
 * key
 * 
 * Responses
 * 200 OK
 */
function authenticate(req, res) {
  console.log(req.body);
  res.sendStatus(200);
}

/**
 * Signs in a user
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function signIn(req, res) {
  console.log(req.body);
  const db = Database.default();

  const User = db.model('User');
  const user = await User.findOne({login: req.body.login});
  if (!user)
    return res.sendStatus(401)
  
  if (!await bcrypt.compare(req.body.password, user.pw_hash))
    return res.sendStatus(401);

  const payload = {
    user_id: user.id
  }
  const token = await jwt.sign(payload,
    process.env.ACCESS_TOKEN_SECRET, 
    {expiresIn: 300});
  res.json({token});
}

/**
 * Signs out a user
 * 
 * @param {*} req 
 * @param {*} res 
 */
function signOut(req, res) {

}

/**
 * Generate a new private-public key pair
 * 
 * 
 * Request Body:
 * 
 * user_id
 */
function generateKey(req, res) {
  console.log(req.body);
}

// module.exports.authenticate = authenticate;
// module.exports.generateKey = generateKey;

module.exports = {
  authenticate,
  signIn,
  signOut,
  generateKey
}