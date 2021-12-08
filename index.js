

const { MongoClient } = require("mongodb");

const kafka = require("./kafka/kafkaProducer")
// Connection URI
const uri =
  "mongodb://abhagupta:pp79nEtrShg9uyBTfzlBlpnQXLKkWVfYt6MeNQAFeUG4z3TDHG9LKmfY4ifF986u94XTlAPW41iw7P3FvnE2FQ==@abhagupta.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@abhagupta@";
  
const client = new MongoClient(uri);

const simulateAsyncPause = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(), 1000);
  });

let changeStream;

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const database =   client.db("membership");
    const collection = database.collection('customer')
   

    const pipeline = [
      { $match: { "operationType": { $in: ["insert", "update", "replace"] } } },
      { $project: { "_id": 1,  "fullDocument": 1, "ns": 1, "documentKey": 1 } }
    ]

     // open a Change Stream on the "haikus" collection
     changeStream = collection.watch(pipeline, { fullDocument: "updateLookup" });

     changeStream.on("change", next => {
      // process any change event
      console.log("received a change to the collection: \t", next);
      
      kafka.sendMessage(next.fullDocument, "quickstart-events");
      
    });

    changeStream.on("error", next => {
      // process any change event
      console.log("error happened", next);
    });
  


    await closeChangeStream(600000, changeStream)

  } finally {
    await client.close();
  }
}

function closeChangeStream(time = 60000, changeStream){

  return new Promise ((resolve) => {
    setTimeout(() => {
      console.log("Closing chnage stream")
      changeStream.close();
      resolve();

    }, time)
  })

}
 run().catch(console.dir);

