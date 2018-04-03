const express = require('express');
const db = require('./db');
const { models } = db;
const { Service, User, Appointment } = models;
const jwt = require('jwt-simple');
const JWT_SECRET = process.env.JWT_SECRET;

const app = express();

module.exports = app;

app.use(require('body-parser').json());

app.get('/', (req, res, next) => {
  res.sendStatus(200);
});

app.get('/api/services', (req, res, next) => {
  Service.findAll()
    .then(services => res.send(services))
    .catch(next);
});

app.post('/api/sessions', (req, res, next)=> {
  User.authenticate(req.body)
    .then( user => res.send({ token: jwt.encode({ id: user.id }, JWT_SECRET)}))
    .catch(next);
});

app.get('/api/sessions/:token', (req, res, next)=> {
  User.findByToken(req.params.token)
    .then( user => res.send(user))
    .catch(next);
});

app.get('/api/users/:id/appointments', (req, res, next)=> {
  User.findById(req.params.id)
    .then( user => Appointment.findByUser(user))
    .then( appointments => res.send(appointments))
    .catch(next);
});
