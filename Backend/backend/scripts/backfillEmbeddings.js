require("dotenv").config();
const mongoose = require("mongoose");
const Resource = require("../models/Resource");
const { generateEmbedding } = require("../utils/embedding");

async function run() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/srp");

  const resources = await Resource.find();

  for (const r of resources) {
    if (!r.embedding || r.embedding.length === 0) {
      const text = `${r.title || ""}. ${r.description || ""}`;
      r.embedding = await generateEmbedding(text);
      await r.save();
      console.log("Updated:", r.title);
    }
  }

  console.log("Done");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});