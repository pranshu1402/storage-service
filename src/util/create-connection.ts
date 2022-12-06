import { logger } from "@src/util/logger";
import mongoose from "mongoose";
import { isEmpty } from "@src/declarations/functions";
import EnvVars from "@src/declarations/major/EnvVars";
import { GridFsStorage } from "multer-gridfs-storage";
import { GridFSBucket } from "mongodb";

let bucket: GridFSBucket;

const createDBConnection = async () => {
  const connectionString = EnvVars.dbConnectionString;

  if (isEmpty(connectionString)) {
    return Promise.reject("Please provide db url to connect to");
  }

  mongoose.connection.on("connected", () => {
    const db = mongoose.connections[0].db;
    bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads"
    }) as GridFSBucket;
    logger.info("Connected to database & bucket created");
  });

  mongoose.connection.on("error", (err) => {
    logger.info("Error: Connecting to database failed," + err.message);
  });

  const connection = await mongoose.connect(connectionString as string, {
    maxPoolSize: 10,
    replicaSet: "rs",
    retryWrites: true,
    readPreference: "secondaryPreferred",
    writeConcern: { w: "majority", j: true }
  });

  return connection;
};

export function initializeStorage() {
  const connectionString = EnvVars.dbConnectionString;

  const storage = new GridFsStorage({
    url: connectionString,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        const filename = file.originalname;
        const fileInfo = {
          filename: filename,
          bucketName: "uploads"
        };
        resolve(fileInfo);
      });
    }
  });

  return storage;
}

export function getGridBucket() {
  return bucket;
}

export default createDBConnection;
