/**
 * Middleware to verify user logged in and is an an admin.
 */

import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";

import HttpStatusCodes from "@src/declarations/major/HttpStatusCodes";
import EnvVars from "@src/declarations/major/EnvVars";
import jwtUtil from "@src/util/jwt-util";
import { IUser } from "@src/models/User";
import pwdUtil from "@src/util/pwd-util";

// **** Variables **** //

const jwtNotPresentErr = "JWT not present in signed cookie.",
  userUnauthErr = "User not authorized to perform this action";

// **** Types **** //

export interface ISessionUser extends JwtPayload {
  _id: string;
  email: string;
  name: string;
  role: IUser["role"];
}

// **** Functions **** //

/**
 * See note at beginning of file.
 */
async function adminMw(req: Request, res: Response, next: NextFunction) {
  // Extract the token
  const cookieName = EnvVars.cookieProps.key,
    jwt = req.signedCookies[cookieName];
  if (!jwt) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: jwtNotPresentErr });
  }

  // Make sure user role is an admin
  const clientData = await jwtUtil.decode<ISessionUser>(jwt);

  if (typeof clientData === "object") {
    res.locals.sessionUser = clientData;
    return next();
    // Return an unauth error if user is not an admin
  } else {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: userUnauthErr });
  }
}

export function getSignedJwtCookieFromUser(user: IUser) {
  return jwtUtil.sign({
    _id: user._id,
    email: user.email,
    name: user.name,
    role: user.role
  });
}

export async function populateJwtCookie(req: Request, res: Response) {
  const { user } = req.body;
  const signedJwt = await getSignedJwtCookieFromUser(user);

  const { key, options } = EnvVars.cookieProps;
  res.cookie(key, signedJwt, options);
}

/**
 * See note at beginning of file.
 */
export async function generatePwdHash(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { user } = req.body;
  if (user?.password) {
    const { password, ...newUserData } = user;

    const passwordHash = await pwdUtil.getHash(password);
    newUserData.pwdHash = passwordHash;
    req.body.user = newUserData as IUser;
    return next();
    // Return an unauth error if user is not an admin
  } else {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ error: userUnauthErr });
  }
}

// **** Export Default **** //

export default adminMw;
