import express from 'express'

const app = express();

app.get('/users', function (req, res) {
  res.send({ msg: 'get success', code: 0 });
});

app.post('/users', function (req, res) {
  res.json({ msg: 'post success', code: 0 })
})

app.get('/books', function (req, res) {
  res.send({ msg: 'get success', code: 0 });
});

app.post('/books', function (req, res) {
  res.json({ msg: 'post success', code: 0 })
})

export default app
