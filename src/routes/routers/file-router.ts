import { Router } from "express";
import FileModel, { IFile, IFileReq } from "@src/models/File";
import { IReq, IRes } from "../shared/types";
import {
  deleteRecord,
  fetchRecordByQuery,
  fetchRecordList,
  insertRecord,
  updateRecord
} from "@src/util/db-helper";
import { getGridBucket, initializeStorage } from "@src/util/create-connection";
import adminMw from "../shared/adminMw";
import multer from "multer";
import { FileNotFoundError } from "@src/declarations/errors";
import { ObjectId } from "mongodb";

// Paths
const paths = {
  listAll: "/all",
  share: "/share/:id",
  download: "/download/:id",
  upload: "/upload",
  remove: "/remove/:id"
} as const;

// **** Setup file routes **** //

const fileRouter = Router();

fileRouter.use(adminMw);

// Get all files
fileRouter.get(paths.listAll, getAll);

// share a file
fileRouter.post(paths.share, share);

// download a file
fileRouter.get(paths.download, download);

// upload a file
fileRouter.post(
  paths.upload,
  multer({ storage: initializeStorage() }).single("file"),
  upload
);

// Delete one file
fileRouter.delete(paths.remove, _delete);

// **** ROUTE HANDLERS **** //

/**
 * Get a file.
 */
async function download(req: IReq, res: IRes) {
  const fileId = req.params.id;
  const fileRecord = (await fetchRecordByQuery({
    collection: FileModel as any,
    req,
    res,
    options: {
      query: { _id: new ObjectId(fileId), userId: res.locals?.sessionUser?._id }
    }
  })) as IFile;

  if (!fileRecord) {
    throw new FileNotFoundError();
  }

  res.set("Content-Type", fileRecord.fileType);
  const readStream = getGridBucket().openDownloadStream(
    new ObjectId(fileRecord.gridFsId)
  );

  readStream.pipe(res);
}

async function share(req: IReq<any>, res: IRes) {
  const fileId = req.params.id;

  updateRecord({
    collection: FileModel as any,
    req,
    res,
    options: {
      body: {
        guestUsers: [req.body.guestUserEmail]
      },
      query: { _id: { $in: [new ObjectId(fileId)] } }
    }
  });
}

/**
 * get all files
 */
async function getAll(req: IReq, res: IRes) {
  fetchRecordList({
    collection: FileModel as any,
    req,
    res,
    options: {
      query: {
        $or: [
          {
            userId: res.locals?.sessionUser?._id
          },
          {
            guestUsers: { $in: [res.locals?.sessionUser?.email] }
          }
        ]
      }
    }
  });
}

/**
 * Add one file.
 */
async function upload(req: IReq<IFileReq>, res: IRes) {
  const data = req.body;

  if (!req.file) {
    throw new FileNotFoundError();
  }

  const fileData: any = req.file;

  const fileDataToSave: IFile = {
    fileName: fileData.filename,
    fileType: fileData.mimetype,
    fileSize: fileData.size,
    category: data.category,
    gridFsId: fileData.id?.toString() || "",
    userId: res.locals?.sessionUser?._id
  };

  insertRecord({
    collection: FileModel as any,
    req,
    res,
    options: {
      body: fileDataToSave
    }
  });
}

/**
 * Delete one file.
 */
async function _delete(req: IReq, res: IRes) {
  const id = req.params.id;

  deleteRecord({
    collection: FileModel as any,
    req,
    res,
    options: {
      body: {},
      query: { _id: { $in: [new ObjectId(id)] } }
    }
  });
}

export default fileRouter;
