import mongoose from "mongoose";

// **** Variables **** //

export enum UserRoles {
  Standard,
  Admin
}

// **** Types **** //

export interface IUser {
  id?: number;
  name: string;
  email: string;
  pwdHash?: string;
  role?: UserRoles;
}

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"]
    },
    email: {
      type: String,
      required: [true, "User email is required"]
    },
    pwdHash: {
      type: String,
      default: ""
    },
    role: {
      type: Number,
      default: UserRoles.Standard
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

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
