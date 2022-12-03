import "@src/pre-start"; // Config Must be the first import
import logger from "jet-logger";

import EnvVars from "@src/declarations/major/EnvVars";
import server from "./server";
import createDBConnection from "./util/create-connection";

console.log(EnvVars);

// **** Start server **** //
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
try {
  createDBConnection()
    .then(() => {
      const msg = "Express server started on port: " + EnvVars.port.toString();
      console.log(msg);
      server.listen(EnvVars.port, () => logger.info(msg));
    })
    .catch((err: Error) => {
      console.log(err);
      logger.info("Unable to start server: " + err.message);
    });
} catch (err) {
  console.log(err);
  logger.info("top level Unable to start server: " + err.message);
}
