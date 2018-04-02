const conn = require('./conn');
const { models } = conn;
const moment = require('moment');
const Service = models.service;
const User = models.user;
const Appointment = models.appointment;
const AppointmentService = models.appointmentService;

const xmas2020 = moment();
xmas2020.set({ month: 11, year: 2020, date: 25, hour: 11, minutes: 30, seconds: 0 });

module.exports = ()=> {
    let users, services, appointments;
    return Promise.all([
      Service.create({ name: 'Hair'}),
      Service.create({ name: 'Nails'}),
      Service.create({ name: 'Makeup'}),
    ])
    .then( _services => {
      services = _services;
      const promises = ['mae', 'lucy', 'curly'].map( username => {
        return User.create({ email: `${username}@glamsquad.com`, password: username.toUpperCase()});
      });
      return Promise.all(promises);
    })
    .then( (_users)=> {
      users = _users;
      return Appointment.create({ userId: users[0].id, time: xmas2020 });
    })
    .then( _appointment => {
      appointments = [_appointment];
      return AppointmentService.create({
        appointmentId: _appointment.id, serviceId: services[0].id
      });
    })
    .then( () => {
      return {
        users,
        services,
        appointments
      };
    });
};
