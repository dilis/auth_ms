docHandlers = require('./entity');
authHandlers = require('./auth');
module.exports = {
  ...docHandlers,
  ...authHandlers
}