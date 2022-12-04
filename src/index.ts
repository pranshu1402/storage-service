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
      const msg = "Express server started on port: 300";
      server.listen(3000, () => logger.info("Server1", msg + "0"));
      server.listen(3001, () => logger.info("Server2", msg + "1"));
      server.listen(3002, () => logger.info("Server3", msg + "2"));
      server.listen(3003, () => logger.info("Server4", msg + "3"));
    })
    .catch((err: Error) => {
      logger.info("Unable to start server: " + err.message);
    });
} catch (err) {
  logger.info("Error, Unable to start server: " + err.message);
}
