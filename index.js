const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wcxgg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('toDoApp').collection('tasks')
        app.post('/add-task', async (req, res) => {
            res.send(await taskCollection.insertOne(req.body))
        })
        app.get('/my-task', async (req, res) => {
            const query = { email: req.query.email }
            res.send(await taskCollection.find(query).toArray())
        })
        app.put('/task-done', async (req, res) => {
            const filter = { _id: ObjectId(req.query.id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    complete: "Completed"
                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options)
            res.send(result);
        })
        app.delete('/delete-task', async (req, res) => {
            const query = { _id: ObjectId(req.query.id) }
            const result = await taskCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally {

    }
}
run().catch(console.dir);