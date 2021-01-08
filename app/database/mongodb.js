const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const {Database, Model} = require('./db.js');

function toSelection(typeInfo) {
  return {type: String};
}

function toList(typeInfo) {
  let fields = {}
  for (let f in typeInfo.fields) {
    fields[f] = toMongooseType(typeInfo.fields[f]);
  }

  /* if there's only one field, just return a list of that one
   * field only, not a list of structure */
  fieldsList = Object.keys(fields);
  if (fieldsList.length == 1)
    return [fields[fieldsList[0]].type];

  return [fields];
}

typeMap = {
  string: typeInfo => ({type: String}),
  boolean: typeInfo => ({type: Boolean}),
  number: typeInfo => ({type: Number}),
  date: typeInfo => ({type: Date}),
  object_id: typeInfo => ({type: mongoose.Schema.Types.ObjectId}),
  list: toList,
  selection: toSelection,
};

autoFields = {
  create_date: {
    type: 'date',
  },
  creator: {
    type: 'object_id'
  },
  update_date: {
    type: 'date',
    evalForDefault: 'Date.now'
  },
  updater: {
    type: 'object_id',
  },
  active: {
    type: 'boolean',
    default: true
  }
}

function toMongooseType(typeInfo) {
  let field = typeMap[typeInfo.type](typeInfo);
  if ('default' in typeInfo)
    field['default'] = typeInfo.default;

  if ('evalForDefault' in typeInfo)
    field['default'] = eval(typeInfo.evalForDefault);

  if ('required' in typeInfo)
    field['required'] = typeInfo.required;

  if ('unique' in typeInfo)
    field['unique'] = typeInfo.unique;

  return field;
}

/**
 * Mongoose implementation of Model
 */
class MongooseModel extends Model {
  constructor(db, schema, props) {
    super(db);
    let mongooseSchema = {};
    const allFields = [autoFields, schema.fields];

    for (let l in allFields) {
      const fl = allFields[l];
      for (let f in fl) {
        mongooseSchema[f] = toMongooseType(fl[f]);
      }
    }
    const sch =new mongoose.Schema(
      mongooseSchema, {
      toJSON: {
        transform(doc, ret) {
          ret.id = ret._id;
          delete ret._id;
          delete ret.__v;
        }
      }
    });
    sch.plugin(uniqueValidator);
    if ('hooks' in props) {
      for (let h in props.hooks) {
        const hook = props.hooks[h];
        sch[hook.when](hook.method, hook.handler);
      }
    }
    sch.pre('save', (next) => {
      // update the automatic fields here
      next();
    });
    const m = mongoose.model(schema.name, sch);
  }
}

/**
 * Mongoose/MongoDB implementation of Database
 */
class MongoDatabase extends Database{
  constructor(url) {
    super(url);
    this._models = {};
  }
  
  start() {
    console.log('Starting ', this.url);
    mongoose.connect(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    return this;
  }
  
  stop() {
    return this;
  }
  
  registerHook(model, when, method, func) {
    // this.models[model]['hooks'][method][when] = func;
    if (!('model' in this._models))
      this._models[model] = {
        hooks: [],
      };
    this._models[model].hooks.push({
      when:when,
      method: method,
      handler: func});
  }

  registerModel(schema) {
    if (!(schema.name in this._models))
      this._models[schema.name] = {}
    const model = new MongooseModel(this, schema, this._models[schema.name]);
    this._models[schema.name]['classObj'] = model;
    return model;
  }

  models() {
    return mongoose.modelNames();
  }

  model(name) {
    return mongoose.model(name);
  }
}

  module.exports = {MongoDatabase, MongooseModel}