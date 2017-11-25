import * as Mongoose from "mongoose";
import * as Bcrypt from "bcryptjs";

interface IUser extends Mongoose.Document {
  userId: number;
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  updateAt: Date;
  validatePassword(requestPassword): boolean;
}
interface IPayloadCreate {
  UserName: string;
  Password: string;
  Email: string;
  Phone: string;
  FullName: string;
  Gender: string;
  Birthday: Date;
  GroupId: string;
  Address: string;
  City: number;
  District: number;
  Manager: string;
}

interface IPayloadUpdate {
  UserName: string;
  Email: string;
  Phone: string;
  FullName: string;
  Gender: string;
  Birthday: Date;
  GroupId: string;
  Address: string;
  City: number;
  District: number;
}


const UserSchema = new Mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  email: {
    type: String,
    // unique: true,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
    timestamps: true,
  });

function hashPassword(password: string): string {
  if (!password) {
    return null;
  }

  return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8));
}

UserSchema.methods.validatePassword = function (requestPassword) {
  return Bcrypt.compareSync(requestPassword, this.password);
};

UserSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) {
    return next();
  }

  user.password = hashPassword(user.password);

  return next();
});

UserSchema.pre('findOneAndUpdate', function () {
  const password = hashPassword(this.getUpdate().$set.password);

  if (!password) {
    return;
  }

  this.findOneAndUpdate({}, { password: password });
});

const UserModel = Mongoose.model<IUser>('User', UserSchema);
export { IUser, UserModel, UserSchema, IPayloadCreate, IPayloadUpdate };