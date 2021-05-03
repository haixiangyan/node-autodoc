const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ msg: 'get users success', code: 0 });
});

router.post('/', (req, res) => {
  res.json({ msg: 'post a user success', code: 0 });
});

module.exports = router;
