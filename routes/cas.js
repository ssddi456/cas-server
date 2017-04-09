var express = require('express');
var router = express.Router();

var url = require('url');
var cas_center_config = require('../conf/cas_center_config');

module.exports = router;

function get_authenticate_callback( service, session) {
    return url.format({
      protocol : 'http',
      host : service,
      pathname : cas_center_config.authenticate_callback_path,
      query : {
        info : url.format({ 
          query : { 
            username : session.username,
            display_name : session.display_name,
            email : session.displayname,
          }})
      }
    });
}

router.get('/login', function( req, resp, next ) {
  var query = req.query;
  var service = query.service;

  var session = req.session;

  if( req.session.username ){
    var session = session.username;
    resp.redirect(get_authenticate_callback(service, session));
  } else {
    // req.session.request_login_service = query.service;
    var now = Date.now();
    var name = 'test_' + now;
    var email = '@test.com';

    session.username = name;
    session.display_name = name;
    session.email = name + email;

    resp.redirect(get_authenticate_callback(service, session));
  }

});

router.get('/authenticate', function( req, resp, next ) {
  var query = req.query;
  var service = query.service;
  var session = req.session;
  var info = query.info;

  try{
    info = url.parse(query.info, true);
  } catch(e){
    next(e);
    return;
  }

  if( info.username ){
    session.username = info.username;
    session.display_name = info.display_name;
    session.email = info.email;
  }

  if( session.originalUrl ) {
    var originalUrl = session.originalUrl;
    session.originalUrl = null;
    session.cas_redirect_timestamp = null;

    resp.redirect(originalUrl);
  }
  if( session.request_login_service ){
    resp.redirect(get_authenticate_callback(service, session));
    session.request_login_service = null;
  } else {
    resp.end('success');
  }

});

var cas_client_config = require('../conf/cas_client_config');

router.login = function( req, resp, next ) {
  session = req.session;
  session.originalUrl = req.originalUrl;
  session.cas_redirect_timestamp = Date.now();

  resp.redirect(
    cas_client_config.cas_server + cas_client_config.cas_server_login_path + 
    url.format({
      query : {
        service : cas_client_config.cas_service_name
      }
    }));
}