

const { MongoClient } = require("mongodb");

// Connection URI
const uri =
  "mongodb://abhagupta:pp79nEtrShg9uyBTfzlBlpnQXLKkWVfYt6MeNQAFeUG4z3TDHG9LKmfY4ifF986u94XTlAPW41iw7P3FvnE2FQ==@abhagupta.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@abhagupta@";
//   const uri =
//   "mongodb://og-member-stg-azure-cosmosdb:E2kLb5D0dAFkv1mBFF5RQr9YdNsgOkKOvEQG4yGtHwouXLPynsmsI8L5qTwxsD5b1BLztXcwF31UYEsjUtiTSw==@og-member-stg-azure-cosmosdb.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@og-member-stg-azure-cosmosdb@";
  // Create a new MongoClient
const client = new MongoClient(uri);



async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const database =   client.db("membership");
    const collection = database.collection('customer');

    await collection.updateOne(
      {customerId: '123456789'},
      {
        $set: {'renew.renewState': "CONFIRMED", 'renew.autoRenew': true}
      }
    )
  } finally {
    await client.close();
  }
}
 run().catch(console.dir);

