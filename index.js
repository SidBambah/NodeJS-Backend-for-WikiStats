require('dotenv').config()
var express = require('express');
var cors = require('cors');
var kafka = require('kafka-node');
var MongoClient = require('mongodb').MongoClient;
require('events').EventEmitter.defaultMaxListeners = 100000

//Kafka Configuration
var Consumer = kafka.Consumer;

const client = new kafka.KafkaClient({kafkaHost: '35.185.103.25:9092'});

var topics = [{
  topic: 'processed'
}];

var options = {
    fetchMaxWaitMs: 10000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'utf8',
    requestTimeout: false
};
var consumer = new Consumer(client, topics, options);

//MongoDB Configuration
var mongoOptions = { 
  server: { 
    socketOptions: { 
      keepAlive: 300000, connectTimeoutMS: 30000 
    } 
  }, 
  replset: { 
    socketOptions: { 
      keepAlive: 300000, 
      connectTimeoutMS : 30000 
    } 
  },
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
const uri = "mongodb+srv://" + process.env.USERNAME + ":" + process.env.PASSWORD + "@" + process.env.HOST + "/" + process.env.DATABASE + "?retryWrites=true&w=majority";

//Express Configuration
var app = express();
app.use(cors());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world');
  });

// EventSource Stream for all of the visualizations
app.get('/domainCountDonut', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  consumer.on('message', function(message){
    var data = JSON.parse(message['value']);
    if (data.hasOwnProperty('domainCountDonut')){
      res.write("data: " + JSON.stringify(data['domainCountDonut']) + "\n\n");
    }
  });
});

app.get('/keyChangesCard', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  consumer.on('message', function(message){
    var data = JSON.parse(message['value']);
    if (data.hasOwnProperty('keyChangesCard')){
      res.write("data: " + JSON.stringify(data['keyChangesCard']) + "\n\n");
    }
  });
});

app.get('/botPercent', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  consumer.on('message', function(message){
    var data = JSON.parse(message['value']);
    if (data.hasOwnProperty('botPercent')){
      res.write("data: " + JSON.stringify(data['botPercent']) + "\n\n");
    }
  });
});

app.get('/topWikiCards', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  consumer.on('message', function(message){
    var data = JSON.parse(message['value']);
    if (data.hasOwnProperty('topWikiCards')){
      res.write("data: " + JSON.stringify(data['topWikiCards']) + "\n\n");
    }
  });
});

app.get('/userLeaderboard', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  consumer.on('message', function(message){
    var data = JSON.parse(message['value']);
    if (data.hasOwnProperty('userLeaderboard')){
      res.write("data: " + JSON.stringify(data['userLeaderboard']) + "\n\n");
    }
  });
});

app.get('/additionLineChart', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  consumer.on('message', function(message){
    var data = JSON.parse(message['value']);
    if (data.hasOwnProperty('additionLineChart')){
      res.write("data: " + JSON.stringify(data['additionLineChart']) + "\n\n");
    }
  });
});

app.get('/deletionLineChart', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  consumer.on('message', function(message){
    var data = JSON.parse(message['value']);
    if (data.hasOwnProperty('deletionLineChart')){
      res.write("data: " + JSON.stringify(data['deletionLineChart']) + "\n\n");
    }
  });
});

app.get('/noeditLineChart', function(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
  consumer.on('message', function(message){
    var data = JSON.parse(message['value']);
    if (data.hasOwnProperty('noeditLineChart')){
      res.write("data: " + JSON.stringify(data['noeditLineChart']) + "\n\n");
    }
  });
});

//MongoDB API for persistent 
app.get('/hourlyChangesBarChart', function(req, res){
  MongoClient.connect(uri, mongoOptions, function(err, db) {
    if (err) throw err;
    var dbo = db.db("wikiStats");
    dbo.collection("daywise_changes").findOne({day: req.query['day']}, {lean: true, projection:{_id:0, day:0}}, function(err, result) {
      if (err) throw err;
      if (result != null){
        formatted = {"labels": Object.keys(result), "data": Object.values(result)};
        res.send(formatted);
      } else {
        res.send({"error": "Day of week not found in database."});
      }
      db.close();
    });
  });
})

app.listen(process.env.PORT || 8080)