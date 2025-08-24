import mongoose, { Schema, Document, HydratedDocument } from 'mongoose';
import { IUser } from '@/types';

export type IUserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUserDocument>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  bookmarks: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog'
  }]
}, {
  timestamps: true
});

export const User = mongoose.model<IUserDocument>('User', userSchema);