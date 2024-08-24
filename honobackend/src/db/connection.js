const mongoose = require("mongoose");

const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.DB, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectionDB() {
  try {
    console.log("DATABASE CONNECTION REQUEST");
    const options = {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    };
    mongoose.set("strictQuery", false);
    await mongoose.connect(process.env.DB);
    mongoose.Promise = global.Promise;
    console.log("DATABASE CONNECTION SUCCESSFUL");
  } catch (error) {
    console.log(error);
  }
}

connectionDB();
