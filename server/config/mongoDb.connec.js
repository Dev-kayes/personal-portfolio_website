import mongoose from "mongoose";
let cached = global.mongoose;
if (!cached) {
  cached = { conn: null, promise: null };
}
const connectDb = async () => {
  console.log("connecting to db...");
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
  }
  console.log("connected to db");
  cached.conn = await cached.promise;
  return cached.conn;
};
export default connectDb;
