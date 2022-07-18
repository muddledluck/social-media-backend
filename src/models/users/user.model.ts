import { Schema, Document, model, Model } from "mongoose";
import config from "config";
import bcrypt from "bcrypt";
export interface UserAttrs {
  name: string;
  email: string;
  password: string;
}

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserModel extends Model<UserDocument> {
  addOne(doc: UserAttrs): UserDocument;
  comparePassword(confirmPassword: string): Promise<Boolean>;
}

export const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  let user = this as UserDocument;
  if (!user.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(config.get<number>("saltWorkFactor"));

  const hash = bcrypt.hashSync(user.password, salt);

  user.password = hash;
  return next();
});

userSchema.statics.addOne = (doc: UserAttrs) => {
  return new User(doc);
};

userSchema.methods.comparePassword = async function (
  confirmPassword: string
): Promise<Boolean> {
  const user = this as UserDocument;

  return bcrypt.compare(confirmPassword, user.password).catch((e) => false);
};

export const User = model<UserDocument, UserModel>("User", userSchema);
