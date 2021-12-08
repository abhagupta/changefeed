

const { MongoClient } = require("mongodb");

// Connection URI
const uri =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000";
//   const uri =
//   "mongodb://og-member-stg-azure-cosmosdb:E2kLb5D0dAFkv1mBFF5RQr9YdNsgOkKOvEQG4yGtHwouXLPynsmsI8L5qTwxsD5b1BLztXcwF31UYEsjUtiTSw==@og-member-stg-azure-cosmosdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@og-member-stg-azure-cosmosdb@";
  // Create a new MongoClient
const client = new MongoClient(uri);



async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const database =   client.db("test");
    const collection = database.collection('customer')

    

    const previousRecord = await  collection.find(
          {'payload.customerId': '123456789', 'payload.timestamp': {$lt: '2021-12-08T20:09:06.794Z'}}
    
        ).sort({'payload.timestamp': -1})
       .limit(1)
       .toArray();


   
    console.log("value", previousRecord);

   
  } finally {
    await client.close();
  }
}
 run().catch(console.dir);

