const JWT_SECRET = process.env.JWT_SECRET;
if(!JWT_SECRET){
  throw 'provide JWT_SECRET';
}
const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/my_db', { 
  logging: false
});
const jwt = require('jwt-simple');

const Service = conn.define('service', {
  name: Sequelize.STRING
});

const User = conn.define('user', {
  email: Sequelize.STRING,
  password: Sequelize.STRING
});

User.findByToken = function(token){
  try {
    const id = jwt.decode(token, JWT_SECRET).id;
    return User.findById(id);
  }
  catch(ex){
    if(ex.message === 'Signature verification failed'){
      return Promise.reject({
        status: 401
      });
    }
    return Promise.reject({
    });
  };
}

User.authenticate = function(credentials){
  return User.findOne({
    where: {
      email: credentials.email,
      password: credentials.password
    }
  })
  .then( user => {
    if(user)
      return user;
    throw { status: 401 };
  });
};

const syncAndSeed = ()=> {
  let services;
  return conn.sync({ force: true })
    .then( ()=> Promise.all([
      Service.create({ name: 'Hair'}),
      Service.create({ name: 'Nails'}),
      Service.create({ name: 'Makeup'}),
    ]))
    .then( _services => {
      services = _services;
      const promises = ['mae', 'lucy', 'curly'].map( username => {
        return User.create({ email: `${username}@glamsquad.com`, password: username.toUpperCase()});
      });
      return Promise.all(promises);
    })
    .then( (users)=> {
      return {
        services,
        users
      };
    });
};

module.exports = {
  syncAndSeed,
  models: {
    Service,
    User
  }
};

