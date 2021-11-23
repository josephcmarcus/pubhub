const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('YOU DID IT!')
});

module.exports = router;