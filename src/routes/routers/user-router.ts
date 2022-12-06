import { Router } from "express";
import UserModel, { IUser } from "@src/models/User";
import { IReq, IRes } from "../shared/types";
import {
  deleteRecord,
  fetchRecordList,
  insertRecord,
  updateRecord
} from "@src/util/db-helper";
import adminMw, { generatePwdHash, populateJwtCookie } from "../shared/adminMw";
import { ObjectId } from "mongodb";

// Paths
const paths = {
  getAll: "/all",
  register: "/register",
  update: "/update",
  delete: "/delete/:id"
} as const;

// **** Setup user routes **** //

const userRouter = Router();

// Get all users
userRouter.get(paths.getAll, adminMw, getAll);

// Add one user
userRouter.post(paths.register, generatePwdHash, registerUser);

// Update one user
userRouter.put(paths.update, adminMw, update);

// Delete one user
userRouter.delete(paths.delete, adminMw, _delete);

// **** ROUTE HANDLERS **** //

/**
 * Get all users.
 */
async function getAll(req: IReq, res: IRes) {
  fetchRecordList({
    collection: UserModel as any,
    req,
    res,
    options: {
      responseParser: (userList, totalCount) => ({
        users: userList,
        totalCount
      }),
      project: { name: 1, email: 1, role: 1 }
    }
  });
}

/**
 * Add one user.
 */
async function registerUser(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;

  insertRecord({
    collection: UserModel as any,
    req,
    res,
    options: {
      body: user,
      callback: async (userData) => {
        req.body.user._id = (userData as IUser)._id;
        await populateJwtCookie(req, res);
      }
    }
  });
}

/**
 * Update one user.
 */
async function update(req: IReq<{ user: IUser }>, res: IRes) {
  const { user } = req.body;

  updateRecord({
    collection: UserModel as any,
    req,
    res,
    options: {
      body: user,
      query: { _id: user._id }
    }
  });
}

/**
 * Delete one user.
 */
async function _delete(req: IReq, res: IRes) {
  const id = +req.params.id;

  deleteRecord({
    collection: UserModel as any,
    req,
    res,
    options: {
      body: {},
      query: { _id: { $in: [new ObjectId(id)] } }
    }
  });
}

export default userRouter;
