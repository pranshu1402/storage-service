import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";

import "express-async-errors";

import BaseRouter from "./routes";
import { logger } from "@src/util/logger";
import EnvVars from "@src/declarations/major/EnvVars";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { NodeEnvs } from "@src/declarations/enums";
import { RouteError } from "@src/declarations/errors";
import { ApiResources } from "./declarations/constants";

/*********************************************
 *              INITIALIZE APP
 *********************************************/
const app = express();

/*********************************************
 *                MIDDLEWARES
 *********************************************/
app.use(
  cors({
    origin: `*`
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.cookieProps.secret));

/* eslint-disable max-len */
app.use(
  morgan(
    ":server :method :url :status :response-time ms - :res[content-length]"
  )
);

morgan.token("server", function (req) {
  const host = req.headers.host;
  const port = host?.split(":")?.[1]?.toString();
  
  switch (port) {
  case "3000":
    return "Server1";
  case "3001":
    return "Server2";
  case "3002":
    return "Server3";
  case "3003":
    return "Server4";
  default:
    return port;
  }
});

if (EnvVars.nodeEnv === NodeEnvs.Production) {
  // Security ***********
  app.use(helmet());
}

/*************************************************************
 *        BASE API ROUTER and ERROR HANDLING MIDDLEWARE
 *************************************************************/
app.use(ApiResources.BASE_ROUTE, BaseRouter);

app.use(
  (
    err: Error,
    _: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
  ) => {
    logger.error(err.message, true);
    let status = HttpStatusCodes.BAD_REQUEST;
    if (err instanceof RouteError) {
      status = err.status;
    }
    return res.status(status).json({ error: err.message });
  }
);

/*************************************************************
 *              Serve front-end content
 *************************************************************/

// Set views directory (html)
const viewsDir = path.join(__dirname, "views");
app.set("views", viewsDir);

// Set static directory (js and css).
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Nav to login pg by default
app.get("/", (_: Request, res: Response) => {
  res.sendFile("login.html", { root: viewsDir });
});

// Redirect to login if not logged in.
app.get("/users", (req: Request, res: Response) => {
  const jwt = req.signedCookies[EnvVars.cookieProps.key];
  if (!jwt) {
    res.redirect("/");
  } else {
    res.sendFile("users.html", { root: viewsDir });
  }
});

// Redirect to login if not logged in.
app.get("/files", (req: Request, res: Response) => {
  const jwt = req.signedCookies[EnvVars.cookieProps.key];
  if (!jwt) {
    res.redirect("/");
  } else {
    res.sendFile("files.html", { root: viewsDir });
  }
});

export default app;
