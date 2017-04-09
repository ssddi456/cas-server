var mongo_config = require('./mongo_config');

module.exports = {
  store : {
    uri: mongo_config.url,
    collection: 'login_users'
  },
  session : {
    secret: 'This is a secret',
    name : '55ud',
    cookie: {
      // maxAge: 1000 * 60 * 60 * 24 * 7
    },
    // Boilerplate options, see: 
    // * https://www.npmjs.com/package/express-session#resave 
    // * https://www.npmjs.com/package/express-session#saveuninitialized 
    resave: true,
    saveUninitialized: true
  }
};