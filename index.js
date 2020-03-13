var express = require('express');
var cors = require('cors');
var kafka = require('kafka-node');

var Consumer = kafka.Consumer;

// const client = new kafka.KafkaClient({kafkaHost: '35.185.103.25:9092'}); // Sid
const client = new kafka.KafkaClient({kafkaHost: '35.231.177.25:9092'}); // Jeswanth


var topics = [{
  topic: 'wikipedia_consumer'
  //topic: 'processed_data'
}];
var options = {
    autoCommit: true,
    fetchMaxWaitMs: 1000,
    fetchMaxBytes: 1024 * 1024,
    encoding: 'utf8'
  };
var consumer = new Consumer(client, topics, options);

var app = express();
app.use(cors());

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world');
  })

app.get('/wikipedia_counter', function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });
    consumer.on('message', function(message){
        var data = message['value'];
        console.log(data);
        res.write("data: " + data + "\n\n");
    });
})

app.listen(process.env.PORT || 8080)