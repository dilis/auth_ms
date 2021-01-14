

/**
 * @class Database abstract 
 */
class Database {
  constructor(url) {
    console.log('dilis');
    this.url = url;
  }

  /**
   * Starts/initializes the database instance
   */
  start() {
    throw new Error('Abstract method');
  }

  /**
   * Stops the database.
   */
  stop() {
    throw new Error('Abstract method');
  }

  /**
   * Registers the given model.
   * 
   * @param {} model 
   */
  registerModel(model) {
    throw new Error('Abstract method');
  }

  /**
   * Returns the list of registered models
   */
  models() {
    throw new Error('Abstract method');
  }

  /**
   * Returns the instance of the named model
   * 
   * @param {String} name Name of the model to lookup
   */
  model(name) {
    throw new Error('Abstract method');
  }
}

/**
 * Class Model
 */
class Model {
  constructor(db) {
    this.db = db;
  }
}

module.exports = {Database, Model};