const db = require('../../db');
const app = require('supertest')(require('../../app'));
const expect = require('chai').expect;

describe('routes', ()=> {
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
  describe('/', ()=> {
    it('exists', ()=> {
      return app.get('/')
        .expect(200);
    });
  });

  describe('/api/services', ()=> {
    it('returns three services', ()=> {
      return app.get('/api/services')
        .expect(200);
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
          return app.get(`/api/sessions/${response.body.token}`);
        })
        .then( response => {
          expect(response.status).to.equal(200);
          const user = response.body;
          return app.get(`/api/users/${user.id}/appointments`)
        })
        .then( response => {
          expect(response.status).to.equal(200);
          expect(response.body.length).to.equal(1);
        });

    });
  });
});
