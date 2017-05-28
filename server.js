var express = require("express"),
  app = express(),
  cfenv = require("cfenv"),
  bodyParser = require('body-parser'),
  routes = require('./routes.js'),
  Cloudant = require('cloudant');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const appEnv = cfenv.getAppEnv();

// serve bower components
app.use('/components',  express.static(__dirname + '/bower_components'));

//serve static file (index.html, images, css)
app.use(express.static(__dirname + '/public'));


  /*
    ROTAS, sim, rotas.
  */

  app.get('/api/doLogin', routes.doLogin);
  app.get('/api/getAssetByCode/', routes.getAssetbyCode);
  app.post('/api/confirmTransaction', routes.confirmTransaction);
  app.get('/api/getStep', routes.getStep);
  app.get('/api/getCurrent', routes.getCurrent);

  app.post('/api/register', routes.register);
  // chainMethods
  app.post('/api/createChain', routes.createChain);
  app.post('/api/passIt', routes.passIt);
  app.get('/api/myAssets', routes.myAssets);
  app.get('/api/getHistory', routes.getHistory);

  /*
  Fim rotas
  */



var port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("To view your app, open this link in your browser: http://localhost:" + port);
});
