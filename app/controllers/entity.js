const mongoose = require('mongoose');
const Database = require('../database');

function createDoc(req, res) {
  const db = Database.default();
  const model = db.model(req.params.modelName);
  const doc = new model(req.body);
  doc.save();
  console.log(doc);
  res.json({id: doc._id});
}

function getDoc(req, res) {
  console.log('model id:' + req.params.docId);
  m = req.model;
  m.find({_id: new mongoose.Types.ObjectId(req.params.docId)})
    .then(doc => doc.length ? res.json(doc) : res.sendStatus(404))
    .catch(err => console.log(err));
}

function searchDoc(req, res){
  console.log('Searching model');
  res.sendStatus(200);
}

async function updateDoc(req, res){
  const ret = await req.model.updateOne({_id: req.params.docId}, req.body);
  if (ret.n)
    res.sendStatus(200);
  else
    res.sendStatus(404);
}

async function replaceDoc(req, res){
  const ret = await req.model.replaceOne(
    {_id: req.params.docId},
    req.body);
  console.log(ret);
  if (ret.n)
    res.sendStatus(200);
  else
    res.sendStatus(404);
}

async function deleteDoc(req, res){
  console.log('removing:', req.params.docId);
  const count = await req.model.deleteOne({_id: new mongoose.Types.ObjectId(req.params.docId)});
  res.sendStatus(200);
}

module.exports = {
  createDoc,
  getDoc,
  searchDoc,
  updateDoc,
  replaceDoc,
  deleteDoc
}