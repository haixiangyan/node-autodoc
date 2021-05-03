const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send({ msg: 'get books success', code: 0 });
});

router.post('/', (req, res) => {
  res.json({ msg: 'post a book success', code: 0 });
});

module.exports = router;
