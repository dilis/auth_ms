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

const {validateToken} = require('../app/middlewares/validate_token');

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

router.post('/:modelName', validateToken, validateModelName, createDoc);
router.get('/:modelName/:docId', validateToken, validateModelName, getDoc);
router.get('/:modelName', validateToken,validateModelName, searchDoc);
router.put('/:modelName/:docId', validateToken,validateModelName, replaceDoc);
router.patch('/:modelName/:docId', validateToken,validateModelName, updateDoc);
router.delete('/:modelName/:docId', validateToken,validateModelName, deleteDoc);

module.exports = router;