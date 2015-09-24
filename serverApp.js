var express = require('express'),
    path = require('path'),
    request = require('request'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    fs = require('fs'),
    gulp = require('gulp'),
    url = require('url');
    
var servicePath = __dirname;
var apps = {};

function startServer(chainId) {
  var app = express();
  var port = 3000 + parseInt(chainId);
  apps[chainId] = app;
  app.engine('html', require('ejs').renderFile);
  app.use('/proxy', function (req, res) {
    var newUrl = 'http://clientapix.gsn2.com/api/v1' + req.url.replace('/proxy', '');
    req.pipe(request({ uri: newUrl, method: req.method })).pipe(res);
  });
  app.use(methodOverride());

  // make sure that asset folder access are static file 
  app.use('/', express.static(servicePath));
  
  // handle the rest as html
  app.get('*', function (request, response) {
    var myPath = url.parse(request.url).pathname.toLowerCase();
    if (myPath.length <= 2 && myPath.indexOf('.') < 0) {
      myPath = path.join('asset/225/index.html');
    }

    if (!(myPath.indexOf('.') > 0 && myPath.indexOf('.aspx') < 0)) {
      myPath = path.join('/asset/225', myPath, 'index.html');
    }
    console.log(myPath);

    var fullPath = path.join(servicePath, myPath);
    if (!fs.existsSync(fullPath)) {
      response.status(404).send(fullPath + ' not found.');
      return;
    }

    var k = fs.readFileSync(fullPath, 'utf8');
    k = k.replace('https://clientapix.gsn2.com/api/v1/content/storeapp/[chainid]/?cdnUrl=/asset/bootstrap/storeApp.js?nocache=1', '/asset/bootstrap/storeApp.js?nocache=1');
    k = k.replace(/\[chainname\]/gi, 'localhost:' + port).replace(/\[chainid\]/gi, chainId);
    k = k.replace('cdn-staging.gsngrocers.com/asset/' + chainId, 'localhost:' + port + '/asset/' + chainId);
    k = k.replace(/.min.js\?nocache=[^'"]+/gi, ".js?nocache=2");
    response.send(k);
  });

  // Start server
  app.listen(port, function() {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
}

// skip first two arguments
if (process.argv.length <= 2) {
  console.log('\n\nError: chain id(s) are required.\n');
  console.log('Example: \n node ' + path.basename(__filename) + ' chainId1 chainId2 chainId3 ...');
  console.log('\n');
}
else {
  process.argv.forEach(function (val, index, array) {
    // skip first two arguments
    if (index > 1)
    {  
      startServer(val);
    }
  });
}
