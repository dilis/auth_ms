const fs = require('fs');
const bcrypt = require('bcrypt');
const Database = require('./database');

async function preUserSave(next) {
  if (this.pw_hash) {
    // don't store the password in plaintext
    const h = await bcrypt.hash(this.pw_hash, 10);
    this.pw_hash = h;
  }

  if (this.type === 'person') {
    // if this user is a person, it should have a unique login
    if (!this.login)
      throw Error('Supply the login for this user');
    else {
      const User = Database.default().model('User');
      const dup = await User.findOne({login: this.login});
      if (dup)
        throw Error('Login is already in use');
    }
  }

  if (this.pkey) {
    // Don't allow the private key to be modified
    this.pkey = undefined;
  }
  next();
}

module.exports = (database) => {
  console.log('loyalty app starting');
  database.start();

  database.registerHook('User', 'pre', 'save', preUserSave);
  const modelsPath = 'app/models';
  fs.readdirSync(modelsPath).forEach(f => {
    console.log('registring ', f);
    const model = JSON.parse(fs.readFileSync(modelsPath + '/' + f, 'utf-8'));
    database.registerModel(model);
  });
  console.log(database._models);
}