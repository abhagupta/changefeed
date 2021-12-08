const { MongoClient } = require("mongodb");
const uri =
  "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000";
const clientMongo = new MongoClient(uri);

const kafka = require('kafka-node')


const jsonDiff = require('json-diff');

async function consumeMessage()  {
    
         await clientMongo.connect();
        const database =   clientMongo.db("test");
        const collection = database.collection('customer')

        Consumer = kafka.Consumer,
        client = new kafka.KafkaClient(),

        consumer = new Consumer(
            client,
            [
                { topic: 'quickstart-events', partition: 0 }
            ],
            {
                autoCommit: false,
                fromOffset: 'latest'
            },
            
        );
    
        //1.Read from Kafka and get customer Id, last modified date
            consumer.on('message', async function (message) {
                const parsedValue = JSON.parse(message.value)
                //console.log(parsedValue.customerId);

                //2. Using CID, LMD get last transaction from DB
                const cid = parsedValue.customerId;
                const messageDate = parsedValue.timestamp;


                let previousRecord = {};

                try{
                    let dbResults = await  collection.find(
                        {'payload.customerId': cid, 'payload.timestamp': {$lt: messageDate}}
                    
                         ).sort({'payload.timestamp': -1})
                        .limit(1)
                        .toArray();

                    if(dbResults)
                    {
                        previousRecord = dbResults[0];
                    }

                }catch(e){
                    console.log(e);
                }

                //3. Compare raw messsagge to DB Raw data

                let diff;

                if(previousRecord) {

                     diff = jsonDiff.diff(previousRecord.payload, parsedValue );
                }

                let payload;

                if(diff)
                {
                    //removing known differences
                    delete diff.timestamp;

                    //4. Store Raw data and change context to DB. 
                
                    try{

                         payload = {
                            payload: parsedValue,
                            changeContext: {
                                difference:diff,
                                context: "Updated", 
                               
                            },
                            createdAt: parsedValue.timestamp,
                            
                        }
                        
                        await collection.insertOne(payload);
                        

                    }catch(e){
                        console.log(e);
                    }
                }
                else{
                    console.log("No diffenence found");
                    payload = {
                        payload: parsedValue,
                        changeContext: {
                            context: "Inserted"
                        }
                    }
                    await collection.insertOne(payload);
                }

                //console.log("Previous Record Payload ", previousRecord.payload)
                //console.log("Kafka Payload ", parsedValue)
                console.log("DIFFERENCE", diff);

            });

    
}


consumeMessage();






