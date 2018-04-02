const JWT_SECRET = 'foo';
process.env.JWT_SECRET = JWT_SECRET;

const jwt = require('jwt-simple');
const moment = require('moment');
const expect = require('chai').expect;
const db = require('../../db');
const { models } = db;
const { Service, User, Appointment } = models;

describe('models', ()=> {
  let seed;
  let usersMap;
  beforeEach(()=> {
    return db.syncAndSeed()
      .then( _seed => seed = _seed )
      .then( ()=> {
        usersMap = seed.users.reduce((memo, user)=> {
          memo[user.email] = user;
          return memo;
        }, {});
      });
  });
  describe('Service', ()=> {
    it('exists', ()=> {
      expect(Service).to.be.ok;
    });
    it('there are three services', ()=> {
      expect(seed.services.length).to.equal(3);
    });
  });
  describe('User', ()=> {
    it('exists', ()=> {
      expect(User).to.be.ok;
    });
    it('there are three users', ()=> {
      expect(seed.users.length).to.equal(3);
    });
    describe('find user from jwt token', ()=> {
      it('can find the user with a valid token', ()=> {
        const mae = usersMap['mae@glamsquad.com'];
        const token = jwt.encode({ id: mae.id }, JWT_SECRET);
        return User.findByToken(token)
          .then( user => {
            expect(user.id).to.equal(mae.id);
          });
      });
      it('throw with invalid token', ()=> {
        const mae = usersMap['mae@glamsquad.com'];
        const token = jwt.encode({ id: mae.id }, 'pdq');
        return User.findByToken(token)
          .then( user => {
            throw 'should not get here';
          })
          .catch( ex => expect(ex.status).to.equal(401));
      });
    });
    describe('authenticate', ()=> {
      it('Can authenticate with correct password', ()=> {
        return User.authenticate(usersMap['mae@glamsquad.com'])
          .then( user => {
            expect(user).to.be.ok;
          });
      });
      it('Can NOT authenticate with incorrect password', ()=> {
        return User.authenticate({
          email: 'mae@glamsquad.com',
          password: 'foobar'
        })
        .then(()=> {
          throw 'should not get here'; 
        })
        .catch( er => {
          expect(er.status).to.equal(401);
        });
      });
    });
  });
  describe('Appointment', ()=> {
    it('exists', ()=> {
      expect(Appointment).to.be.ok;
    });
    it('mae has a hair appointment in 2021', ()=> {
      const mae = usersMap['mae@glamsquad.com'];
      return Appointment.findByUser(mae)
        .then( appointments => {
          expect(appointments.length).to.equal(1);
          expect(moment(appointments[0].time).get('year')).to.equal(2020);
          expect(appointments[0].appointmentServices[0].service.name).to.equal('Hair');
        });
    });
  });
});
