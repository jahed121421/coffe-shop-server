const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
const uri =
  "mongodb+srv://jahedahmed2:kZ68cOT0hDL6K2U9@cluster0.7bfhsu6.mongodb.net/?retryWrites=true&w=majority";
app.use(cors(corsOptions));
app.use(express.json());
const port = process.env.PORT || 5000;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const dataCollections = client.db("Coffee-shop").collection("all-data");
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.get("/all-data", async (req, res) => {
      const result = await dataCollections.find().toArray();
      res.send(result);
    });

    app.get("/coffee-details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollections.findOne(query);
      res.send(result);
    });

    app.delete("/coffee-delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataCollections.deleteOne(query);
      res.send(result);
    });

    app.put("/coffee-update/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: body.name,
          description: body.description,
          price: body.price,
          image: body.price,
          origin: body.origin,
          caffeine_content: body.caffeine_content,
          status: "pending",
        },
      };
      const result = await dataCollections.updateOne(query, updateDoc, options);
      res.send(result);
    });

    app.put("/approved-post/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: "apporved",
        },
      };
      const options = {
        upsert: true,
      };
      const result = await dataCollections.updateOne(query, updateDoc, options);
      res.send(result);
    });
    app.put("/decline-post/:id", async (req, res) => {
      const id = req.params.id;
      const body = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          status: decline,
          message: body.message,
        },
      };
      const options = {
        upsert: true,
      };
      const result = await dataCollections.updateOne(query, updateDoc, options);
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Coffee-shop-server running on ${port}`);
});
