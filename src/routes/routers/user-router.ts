import { Router } from "express";
import UserModel, { IUser } from "@src/models/User";
import { IReq, IRes } from "../shared/types";
import {
  deleteRecord,
  fetchRecordList,
  insertRecord,
  updateRecord
} from "@src/util/db-helper";
import adminMw from "../shared/adminMw";

// Paths
const paths = {
  get: "/all",
  add: "/register",
  update: "/update",
  delete: "/delete/:id"
} as const;

// **** Setup user routes **** //

const userRouter = Router();

// Get all users
userRouter.get(paths.get, getAll);

// Add one user
userRouter.post(paths.add, registerUser);

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
    options: {}
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
      body: user
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
      query: { id: user.id }
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
      query: { id: { $in: [id] } }
    }
  });
}

export default userRouter;
