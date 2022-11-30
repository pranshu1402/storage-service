import logger from "jet-logger";
import mongoose from "mongoose";
import { isEmpty } from "@src/declarations/functions";
import EnvVars from "@src/declarations/major/EnvVars";

const connectionString = EnvVars.dbConnectionString;

const createDBConnection = () => {
  if (isEmpty(connectionString)) {
    return Promise.reject("Please provide db url to connect to");
  }

  mongoose.connection.on("connected", () => {
    logger.info("Connected to database");
  });

  mongoose.connection.on("error", (err) => {
    logger.info("Error: Connecting to database failed," + err.message);
  });

  return mongoose.connect(connectionString as string);
};

export default createDBConnection;
