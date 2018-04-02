const JWT_SECRET = process.env.JWT_SECRET;
const moment = require('moment');
if(!JWT_SECRET){
  throw 'provide JWT_SECRET';
}
const jwt = require('jwt-simple');

const conn = require('./conn');
const User = require('./User');
const Service = require('./Service');
const Appointment = require('./Appointment');
const AppointmentService = require('./AppointmentService');


Appointment.belongsTo(User);
AppointmentService.belongsTo(Service);
AppointmentService.belongsTo(Appointment);
Appointment.hasMany(AppointmentService);


const syncAndSeed = ()=> {
  let services, users, appointments;
  return conn.sync({ force: true })
    .then(()=> require('./seed')());
};

module.exports = {
  syncAndSeed,
  models: {
    Service,
    User,
    Appointment,
    AppointmentService
  }
};

