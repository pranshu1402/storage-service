import mongoose from "mongoose";
import { Binary } from "mongodb";

// **** Types **** //

export interface IFile {
  id?: string;
  fileName: string;
  userId: string;
  gridFsId?: string;
  content?: Binary;
}

const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: [true, "File name is required"]
    },
    userId: {
      type: String,
      required: [true, "Owner id is required"]
    },
    gridFsId: {
      type: String,
      default: ""
    },
    content: {
      type: Binary,
      default: null
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: Number,
    updatedBy: Number
  },
  { timestamps: true }
);

const FileModel = mongoose.model("File", FileSchema);

export default FileModel;
