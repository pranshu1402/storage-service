import { Router } from "express";
import jetValidator from "jet-validator";
import { IReq, IRes } from "../shared/types";
import EnvVars from "@src/declarations/major/EnvVars";
import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import { fetchRecordByQuery } from "@src/util/db-helper";
import UserModel, { IUser } from "@src/models/User";
import { isEmpty, tick } from "@src/declarations/functions";
import { RouteError } from "@src/declarations/errors";
import pwdUtil from "@src/util/pwd-util";
import jwtUtil from "@src/util/jwt-util";

// **** Variables **** //

// Paths
const paths = {
  login: "/login",
  logout: "/logout"
} as const;

const validate = jetValidator();

// **** Setup auth routes **** //

const authRouter = Router();

authRouter.post(paths.login, validate("email", "password"), login);
authRouter.get(paths.logout, logout);

// **** Types **** //

interface ILoginReq {
  email: string;
  password: string;
}

// Errors
export const errors = {
  unauth: "Unauthorized",
  emailNotFound: (email: string) => `User with email "${email}" not found`
} as const;

// **** ROUTE HANDLERS **** //

/**
 * Login a user.
 */
async function login(req: IReq<ILoginReq>, res: IRes) {
  const jwt = await getJwt(req, res);
  const { key, options } = EnvVars.cookieProps;
  res.cookie(key, jwt, options);
  // Return
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Logout the user.
 */
function logout(_: IReq, res: IRes) {
  const { key, options } = EnvVars.cookieProps;
  res.clearCookie(key, options);
  return res.status(HttpStatusCodes.OK).end();
}

/**
 * Login a user.
 */
async function getJwt(req: IReq<ILoginReq>, res: IRes): Promise<string> {
  const { email, password } = req.body;

  // Fetch user
  const user = (await fetchRecordByQuery({
    collection: UserModel as any,
    req,
    res,
    options: {
      query: { email: email }
    }
  })) as IUser;
  if (isEmpty(user)) {
    throw new RouteError(
      HttpStatusCodes.UNAUTHORIZED,
      errors.emailNotFound(email)
    );
  }
  // Check password
  const hash = user.pwdHash ?? "";
  const pwdPassed = await pwdUtil.compare(password, hash);
  if (!pwdPassed) {
    // If password failed, wait 500ms this will increase security
    await tick(500);
    throw new RouteError(HttpStatusCodes.UNAUTHORIZED, errors.unauth);
  }
  // Setup Admin Cookie
  return jwtUtil.sign({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });
}

export default authRouter;
