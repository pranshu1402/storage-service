import { Router } from "express";
import FileModel, { IFile } from "@src/models/File";
import { IReq, IRes } from "../shared/types";
import {
  deleteRecord,
  fetchRecordList,
  insertRecord,
  updateRecord
} from "@src/util/db-helper";

// Paths
const paths = {
  get: "/all",
  add: "/add",
  update: "/update",
  delete: "/delete/:id"
} as const;

// **** Setup user routes **** //

const fileRouter = Router();

// Get all users
fileRouter.get(paths.get, getAll);

// Add one user
fileRouter.post(paths.add, add);

// Update one user
fileRouter.put(paths.update, update);

// Delete one user
fileRouter.delete(paths.delete, _delete);

// **** ROUTE HANDLERS **** //

/**
 * Get all files.
 */
async function getAll(req: IReq, res: IRes) {
  fetchRecordList({
    collection: FileModel as any,
    req,
    res,
    options: {}
  });
}

/**
 * Add one file.
 */
async function add(req: IReq<{ user: IFile }>, res: IRes) {
  const { user } = req.body;

  insertRecord({
    collection: FileModel as any,
    req,
    res,
    options: {
      body: user
    }
  });
}

/**
 * Update one file.
 */
async function update(req: IReq<{ user: IFile }>, res: IRes) {
  const { user } = req.body;

  updateRecord({
    collection: FileModel as any,
    req,
    res,
    options: {
      body: user,
      query: { id: user.id }
    }
  });
}

/**
 * Delete one file.
 */
async function _delete(req: IReq, res: IRes) {
  const id = +req.params.id;

  deleteRecord({
    collection: FileModel as any,
    req,
    res,
    options: {
      body: {},
      query: { id: { $in: [id] } }
    }
  });
}

export default fileRouter;
