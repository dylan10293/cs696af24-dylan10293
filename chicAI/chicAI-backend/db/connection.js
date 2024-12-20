import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  tls: true,
  serverSelectionTimeoutMS: 5000,
});
try {
  await client.connect();
  await client.db("chicAI").command({ ping: 1 });
  console.log(
    "Pinged your deployment. You successfully connected to MongoDB!"
  );
} catch (err) {
  console.error("mongo: ", err);
}
let db = client.db("chicAI");
export default db;