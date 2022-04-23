var express = require('express');
var path = require('path');
var app = express();
var port = 3000;

var _data = {results: []};

app.use(function(req, res, next) {
  console.log('New request for ' + req.path + ' with type ' + req.method);
  next();
});
app.use(express.static(path.join(__dirname, '../')));
app.use(express.json());

var x = path.join(__dirname + '/../', 'client');
app.get('/', function(req, res) {
  res.sendFile(path.join(x, 'chatterbox.html'));
});

app.get('/classes/messages', (req, res) => {
  if (req.query.order) {
    var revData = _data.results.slice();
    revData.reverse();
    res.json({results: revData});
  } else {
    res.json(_data);
  }
});

app.post('/classes/messages', (req, res) => {
  var body = req.body;
  body.createdAt = new Date();
  _data.results.push(body);
  res.status(201).json(body);
});

app.options('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  res.send(200);
});

app.get('*', function(req, res) {
  res.send('404', 404);
});

app.post('*', function(req, res) {
  res.send('404', 404);
});

app.listen(port, () => {
  console.log('Express istening on port ' + port);
});