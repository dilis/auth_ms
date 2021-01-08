const {MongoDatabase} = require('./mongodb');

class DatabaseManager {
  static instance;
  constructor() {
    this.databases = [];
  }

  static getInstance() {
    if (!DatabaseManager.instance)
      DatabaseManager.instance = new DatabaseManager();
    return DatabaseManager.instance;
  }

  /**
   * Creates a new database instance from passed URL
   * 
   * @param {String} url The URL of the database to connect to
   * @return {Database} The new database instance
   */
  static forUrl(url) {
    const dbMgr = DatabaseManager.getInstance();
    return dbMgr.getDbForUrl(url);
  }

  static default() {
    const dbMgr = DatabaseManager.getInstance();
    return dbMgr.getDefaultDb();
  }

  getDbForUrl(url) {
    for (let x in this.databases)
      if (this.databases[x].url == url)
        return this.databases[x].instance;
    
    this.databases.push({
      url,
      instance: new MongoDatabase(url)
    });
  
    return this.databases[this.databases.length - 1].instance;
  }

  getDefaultDb() {
    return this.databases[0].instance;
  }
}

module.exports = DatabaseManager;