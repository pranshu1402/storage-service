import "@src/pre-start"; // Config Must be the first import
import { logger } from "@src/util/logger";

import EnvVars from "@src/declarations/major/EnvVars";
import server from "./server";
import createDBConnection from "./util/create-connection";

// **** Start server **** //
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
try {
  createDBConnection()
    .then(() => {
      const msg = "Express server started on port: " + EnvVars.port.toString();
      server.listen(3000, () => logger.info("Server1", msg));
      server.listen(3001, () => logger.info("Server2", msg));
      server.listen(3002, () => logger.info("Server3", msg));
      server.listen(3003, () => logger.info("Server4", msg));
    })
    .catch((err: Error) => {
      logger.info("Unable to start server: " + err.message);
    });
} catch (err) {
  logger.info("Error, Unable to start server: " + err.message);
}
