const conn = require('./conn');
const { Sequelize } = conn;

const Appointment = conn.define('appointment', {
  time: {
    type: Sequelize.DATE,
    allowNull: false
  }
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

Appointment.createFromRequest = function(req){
  let appointment;
  return this.create({ userId: req.params.id, time: req.body.time })
    .then( _appointment => {
      appointment = _appointment;
      return Promise.all(
        req.body.appointmentServices.map( appointmentService => conn.models.service.findById(appointmentService.serviceId))
      );
    })
    .then( services => {
      return Promise.all(
        services.map( service => {
          return conn.models.appointmentService.create({
            serviceId: service.id,
            appointmentId: appointment.id
          });
        })
      );
    })
    .then( () => {
      return Appointment.findById(appointment.id, {
        include: [
          {
            model: conn.models.appointmentService,
            include: [ conn.models.service ]
          }
        ]
      })
    });
};

module.exports = Appointment;
