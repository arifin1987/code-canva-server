const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.59h68ks.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const laptopCollection = client.db("codecanva").collection("laptops");
    const cartCollection = client.db("codecanva").collection("carts");

    app.get("/laptops", async (req, res) => {
      const result = await laptopCollection.find().toArray();
      res.send(result);
    });

    app.post("/laptops", async (req, res) => {
      const item = req.body;
      const result = await laptopCollection.insertOne(item);
      res.send(result);
    });
    app.get("/laptops/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await laptopCollection.findOne(query);
      res.send(result);
    });

    app.delete("/laptops/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await laptopCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/laptops/:id", async (req, res) => {
      const id = req.params.id;
      const laptop = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          image: laptop.image,
          price: laptop.price,
          name: laptop.name,
          configuration: laptop.configuration,
          product_rating: laptop.product_rating,
          brand: laptop.brand,
          flash_sale: laptop.flash_sale,
          top_category: laptop.top_category,
          description: laptop.description,
        },
      };
      const options = { upsert: true };
      const result = await laptopCollection.updateOne(
        query,
        updateDoc,
        options
      );

      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const item = req.body;
      const result = await cartCollection.insertOne(item);
      res.send(result);
    });
    app.get("/carts", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(" code canva server is running");
});

app.listen(port, () => {
  console.log(`app is runnig on port ${port}`);
});
