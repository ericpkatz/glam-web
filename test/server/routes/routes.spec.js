const db = require('../../../db');
const app = require('supertest')(require('../../../app'));
const expect = require('chai').expect;
const moment = require('moment');

const xmas2021 = moment();
xmas2021.set({ month: 11, year: 2021, date: 25, hour: 11, minutes: 30, seconds: 0 });


describe('routes', ()=> {
  let seed;
  let usersMap, servicesMap;
  beforeEach(()=> {
    return db.syncAndSeed()
      .then( _seed => seed = _seed )
      .then( ()=> {
        usersMap = seed.users.reduce((memo, user)=> {
          memo[user.email] = user;
          return memo;
        }, {});
        servicesMap = seed.services.reduce((memo, service)=> {
          memo[service.name] = service;
          return memo;
        }, {});
      });
  });
  describe('/', ()=> {
    it('exists', ()=> {
      return app.get('/')
        .expect(200);
    });
  });

  describe('/api/services', ()=> {
    it('returns three services', ()=> {
      return app.get('/api/services')
        .expect(200)
        .then( result => {
          expect(result.body.length).to.equal(3);
        });
    });
  });
  describe('logging in', ()=> {
    it('user can log in with correct credentials', ()=> {
      const mae = usersMap['mae@glamsquad.com'];
      const { email, password } = mae;
      const credentials = {
        email,
        password
      };
      return app.post('/api/sessions')
        .send(credentials)
        .expect(200)
        .then( response => {
          return app.get(`/api/sessions/${response.body.token}`)
        })
        .then( response => {
          expect(response.status).to.equal(200);
          expect(response.body.email).to.equal(mae.email);
        });

    });
    it('user can not log in with incorrect credentials', ()=> {
      const mae = usersMap['mae@glamsquad.com'];
      const { email } = mae;
      const credentials = {
        email,
        password: 'foo'
      };
      return app.post('/api/sessions')
        .send(credentials)
        .expect(401);
    });
  });
  describe('getting appointments', ()=> {
    it('a user can get their appointments', ()=> {
      const mae = usersMap['mae@glamsquad.com'];
      const { email, password } = mae;
      const credentials = {
        email,
        password
      };
      return app.post('/api/sessions')
        .send(credentials)
        .expect(200)
        .then( response => {
          expect(response.status).to.equal(200);
          return (
            app
              .get(`/api/users/${mae.id}/appointments`)
              .set('Authorization', response.body.token)
          );
        })
        .then( response => {
          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(1);
        });
    });
  });
  describe('creating an appointments', ()=> {
    it('a user can create an appointments', ()=> {
      const mae = usersMap['mae@glamsquad.com'];
      const { email, password } = mae;
      const credentials = {
        email,
        password
      };
      let token;
      return app.post('/api/sessions')
        .send(credentials)
        .expect(200)
        .then( response => {
          token = response.body.token;
          return app.get(`/api/sessions/${response.body.token}`);
        })
        .then( response => {
          const user = response.body;
          return app
                    .post(`/api/users/${user.id}/appointments`)
                    .set('Authorization', token)
                    .send({
                      time: xmas2021,
                      appointmentServices: [
                        {
                          serviceId: servicesMap['Hair'].id
                        },
                        {
                          serviceId: servicesMap['Makeup'].id
                        }
                      ]
                    })
                  
        })
        .then( response => {
          expect(response.status).to.equal(200);
          const appointmentServices = response.body.appointmentServices;
          expect(appointmentServices.length).to.equal(2);
          const serviceNames = appointmentServices.map( appointmentService => appointmentService.service.name );
          expect(serviceNames.indexOf('Hair')).not.to.equal(-1);
          expect(serviceNames.indexOf('Makeup')).not.to.equal(-1);
          return app.get(`/api/users/${mae.id}/appointments`)
                    .set('Authorization', token)
        })
        .then( response => {
          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(2);
        });
    });
  });
});
