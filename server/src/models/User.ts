import { Schema, model, type Document } from 'mongoose';
import bcrypt from 'bcrypt';
import type { UnitDocument } from './Unit.js';

export enum UserRole {
  EVALUATOR = 'EVALUATOR',
  USER = 'USER'
}

export interface UserDocument extends Document {
  id: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  unit?: UnitDocument['_id'];
  isCorrectPassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, 'Must use a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.USER
    },
    unit: {
      type: Schema.Types.ObjectId,
      ref: 'Unit',
      validate: {
        validator: function(this: UserDocument) {
          // Unit is required only for USER role
          return this.role !== UserRole.USER || this.unit != null;
        },
        message: 'Unit is required for user'
      }
    }
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

// Hash user password before saving
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Custom method to compare passwords
userSchema.methods.isCorrectPassword = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

// Ensure Evaluator role does not have a unit
userSchema.pre('save', function (next) {
  if (this.role === UserRole.EVALUATOR && this.unit) {
    this.unit = undefined;
  }
  next();
});

const User = model<UserDocument>('User', userSchema);

export default User;