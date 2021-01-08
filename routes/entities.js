const mongoose = require('mongoose');
const router =  require('express').Router();

// controllers
const {
  createDoc,
  getDoc,
  searchDoc,
  replaceDoc,
  updateDoc,
  deleteDoc,
} = require('../app/controllers');

function validateModelName(req, res, next) {
  console.log(req.params);
  console.log('in validate')
  if (!('modelName' in req.params)) {
    res.sendStatus(404);
    return;
  }
  try {
    req.model =  mongoose.model(req.params.modelName);
  }
  catch (err) {
    console.log('in catch')
    res.sendStatus(404);
    return;
  }
  next();
}

router.post('/:modelName', validateModelName, createDoc);
router.get('/:modelName/:docId', validateModelName, getDoc);
router.get('/:modelName', validateModelName, searchDoc);
router.put('/:modelName/:docId', validateModelName, replaceDoc);
router.patch('/:modelName/:docId', validateModelName, updateDoc);
router.delete('/:modelName/:docId', validateModelName, deleteDoc);

module.exports = router;