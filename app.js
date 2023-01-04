const express = require('express');
const { uuid } = require('uuidv4');

const models = require('./models');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.context = {
    models,
    me: models.users[1],
  };
  next();
});

app.get('/users', (req, res) => {
  res.send(Object.values(req.context.models.users));
});

app.get('/users/:userId', (req, res) => {
  res.send(req.context.models.users[req.params.userId]);
});

app.get('/messages', (req, res) => {
  res.send(Object.values(req.context.models.messages));
});

app.get('/messages/:messageId', (req, res) => {
  res.send(req.context.models.messages[req.params.messageId]);
});

app.post('/messages', (req, res) => {
  const id = uuid();
  const message = {
    id,
    text: req.body.text,
    userId: req.context.me.id,
  };

  req.context.models.messages[id] = message;

  return res.send(message);
})

app.delete('/messages/:messageId', (req, res) => {
  const {
    [req.params.messageId]: message,
    ...otherMessages
  } = req.context.models.messages;

  req.context.models.messages = otherMessages;

  return res.send(message);
})

app.post('/users', (req, res) => {
  res.send('Received a POST HTTP on user method');
});

app.put('/users/:userId', (req, res) => {
  res.send(
    `Received a PUT HTTP on user/${req.params.userId} method`
  );
});

app.delete('/users/:userId', (req, res) => {
  res.send(
    `Received a DELETE HTTP on user/${req.params.userId} method`
  );
});

app.get('/session', (req, res) => {
  res.send(req.context.models.users[req.context.me.id]);
});

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}...`)
});