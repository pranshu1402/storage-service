import logger from "jet-logger";
import mongoose from "mongoose";
import { isEmpty } from "@src/declarations/functions";
import EnvVars from "@src/declarations/major/EnvVars";
import { GridFSBucket } from "mongodb";

let bucket: any;

const createDBConnection = () => {
  const connectionString = EnvVars.dbConnectionString;

  console.log("inside create connection", connectionString);
  if (isEmpty(connectionString)) {
    return Promise.reject("Please provide db url to connect to");
  }

  mongoose.connection.on("connected", () => {
    const db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "newBucket"
    });
    logger.info("Connected to database & bucket created");
  });

  mongoose.connection.on("error", (err) => {
    logger.info("Error: Connecting to database failed," + err.message);
  });

  return mongoose.connect(connectionString as string);
};

export function getGridBucket() {
  return bucket;
}

export default createDBConnection;
