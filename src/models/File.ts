import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// **** Types **** //

export interface IFileReq {
  category: string;
  file: any;
}

export interface IFile {
  _id?: string | ObjectId;
  fileName: string;
  fileType: string;
  fileSize?: number;
  category: string;
  userId: string;
  gridFsId?: string;
}

const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: [true, "File name is required"]
    },
    fileType: {
      type: String,
      required: [true, "File type is required"]
    },
    fileSize: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      required: [true, "File category is required"]
    },
    gridFsId: {
      type: String,
      default: ""
    },
    userId: {
      type: String,
      required: [true, "Owner identity is required"]
    },
    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const FileModel = mongoose.model("File", FileSchema);

export default FileModel;
