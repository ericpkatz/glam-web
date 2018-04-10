const express = require('express');
const db = require('./db');
const { models } = db;
const { Service, User, Appointment, AppointmentService } = models;
const jwt = require('jwt-simple');
const JWT_SECRET = process.env.JWT_SECRET;
const path = require('path');

const app = express();

module.exports = app;

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/templates', express.static(path.join(__dirname, 'public', 'templates')));

app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));

app.use(require('body-parser').json());

app.use((req, res, next)=> {
  if(req.headers.authorization){
    return User.findByToken(req.headers.authorization)
      .then( user => {
        req.user = user;
        next();
      })
      .catch(next);
  }
  next();
});

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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
  if(!req.user || req.user.id !== req.params.id*1){
    return next({ status: 401 });
  }
  User.findAppointments(req.params.id)
    .then( appointments => res.send(appointments))
    .catch(next);
});

app.post('/api/users/:id/appointments', (req, res, next)=> {
  if(!req.user || req.user.id !== req.params.id*1){
    return next({ status: 401 });
  }
  Appointment.createFromRequest(req)
    .then( appointment => res.send(appointment))
    .catch(next);
});
