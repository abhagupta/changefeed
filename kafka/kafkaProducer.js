const kafka = require('kafka-node');

const Producer = kafka.Producer;
const KeyedMessage = kafka.KeyedMessage;

const client = new kafka.KafkaClient({kafkaHost: '127.0.0.1:9092'});

const km = new KeyedMessage('key', 'message');

const producer = new Producer(client);

const sendMessage = (message, topic) => {
    
    message.timestamp = new Date();

    payloads = [
        { topic, messages: JSON.stringify(message) }
    ];
    producer.send(payloads, function (err, data) {
        if(err){
            console.log("error happened:", err);
        }
        console.log(data);
    });
}



producer.on('error', function (err) {})

module.exports = {
    sendMessage
}