var express = require('express');
var router = express.Router();

var url = require('url');
var cas = require('./cas');


router.need_login = function( level ) {
  return function( req, resp, next ) {
    var session = req.session;

    if( session.username ){
      next();
    } else {
      cas.login(req, resp, next);
    }
  };
}

/* GET users listing. */
router.get('/', 
  router.need_login(),
  function(req, resp, next) {
    var session = req.session;

    resp.end('respond with a resource ' + session.display_name);
  });

module.exports = router;
