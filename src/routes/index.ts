import { Router } from "express";

import authRouter from "./routers/auth-router";
import userRouter from "./routers/user-router";
import { ApiResources } from "@src/declarations/constants";
import fileRouter from "./routers/file-router";

// **** Init **** //

const apiRouter = Router();

apiRouter.use(ApiResources.AUTH_BASE_ROUTE, authRouter);

apiRouter.use(ApiResources.USER_BASE_ROUTE, userRouter);

apiRouter.use(ApiResources.FILE_BASE_ROUTE, fileRouter);

// **** Export default **** //

export default apiRouter;
