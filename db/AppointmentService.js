const conn = require('./conn');
const { Sequelize } = conn;

const AppointmentService = conn.define('appointmentService', {
});

module.exports = AppointmentService;
