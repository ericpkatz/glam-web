const conn = require('./conn');
const { Sequelize } = conn;

const Appointment = conn.define('appointment', {
  time: Sequelize.DATE
});

Appointment.findByUser = function(user){
  return this.findAll({
    where: { userId : user.id },
    include: [
      {
        model: conn.models.appointmentService,
        include: [
          conn.models.service
        ]
      }
    ]
  });
};

module.exports = Appointment;
