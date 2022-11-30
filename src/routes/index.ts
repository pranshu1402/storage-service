import { Router } from "express";

import adminMw from "./shared/adminMw";
import authRouter from "./routers/auth-router";
import userRouter from "./routers/user-router";
import { ApiResources } from "@src/declarations/constants";

// **** Init **** //

const apiRouter = Router();

apiRouter.use(ApiResources.AUTH_BASE_ROUTE, authRouter);

apiRouter.use(ApiResources.USER_BASE_ROUTE, adminMw, userRouter);

// **** Export default **** //

export default apiRouter;
