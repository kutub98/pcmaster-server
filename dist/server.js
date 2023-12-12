import config from "../config/index.js";
import cors from "cors";
import express from "express";
import { BAD_REQUEST } from "http-status-codes";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

const port = config.Port;
const uri = config.DataBaseUrl;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function run() {
  try {
    await client.connect();
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

// collection
const PCitems = client.db("PCMASTER").collection("PCITEMS");

// Get a single PC item by ID
app.get("/pcItems/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    // const singleCategory = await PCitems.map((category)=> id === category.id)
    const pcItemData = await PCitems.findOne({ _id: new ObjectId(id) });

    if (pcItemData) {
      res.status(200).json({
        success: true,
        message: "Successfully retrieved single PC item",
        data: pcItemData,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "PC item not found",
      });
    }
  } catch (err) {
    console.error("Error fetching PC item:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve the PC item",
    });
  }
});

app.get("/pcItems/allProducts/:id", async (req, res) => {
  const { id } = req.params;
  const pcItemDatadata = await PCitems.find({}).toArray();
  for (const category of pcItemDatadata) {
    for (const item of category.items) {
      if (item.itemId === id) {
        res.status(200).json({
          success: true,
          message: "Successfully retrived single item",
          data: item,
        });
        return;
      }
    }
  }
  res.status(400).json({
    success: false,
    message: "Successfully retrived single item",
  });
});

// get all pc items
app.use("/pcItems", async (req, res) => {
  try {
    const pcItemsData = await PCitems.find({}).toArray();
    //  const AllCategory = pcItemsData.map((category)=> category.name)
    //  console.log(AllCategory)
    res.status(200).json({
      success: true,
      message: "Successfully retrieved PC items",
      data: pcItemsData,
    });
  } catch (err) {
    console.error("Error fetching PC items:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve PC items",
    });
  }
});

app.listen(5000, () => {
  console.log(`Listening on Port ${port}`);
});

run().catch(console.error);
