import "@src/pre-start"; // Config Must be the first import
import logger from "jet-logger";

import EnvVars from "@src/declarations/major/EnvVars";
import server from "./server";
import createDBConnection from "./util/create-connection";

// **** Start server **** //
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
try {
  createDBConnection()
    .then(() => {
      const msg = "Express server started on port: " + EnvVars.port.toString();
      server.listen(EnvVars.port, () => logger.info(msg));
    })
    .catch((err: Error) => {
      logger.info("Unable to start server: " + err.message);
    });
} catch (err) {
  logger.info("Error, Unable to start server: " + err.message);
}
