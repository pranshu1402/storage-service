import mongoose from "mongoose";

// **** Types **** //

export interface IFile {
  _id?: any;
  fileName: string;
  gridFsId?: string;
  deleted?: boolean;
  createdBy: string;
  updatedBy?: string;
}

const { Schema } = mongoose;

const FileSchema = new Schema(
  {
    fileName: {
      type: String,
      required: [true, "File name is required"]
    },
    gridFsId: {
      type: String,
      default: ""
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdBy: String,
    updatedBy: String
  },
  { timestamps: true }
);

const FileModel = mongoose.model("File", FileSchema);

export default FileModel;
