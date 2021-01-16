const router = require('express').Router();
const {
  authenticate,
  signIn,
  signOut,
  generateKey
} = require('../app/controllers');

router.post('/auth', authenticate);
router.post('/signIn', signIn);
router.post('/signOut', signOut);
router.post('/gen_key', generateKey);

module.exports = router;