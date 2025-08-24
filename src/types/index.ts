import { Types } from "mongoose";

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  bookmarks: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlog {
  _id?: string;
  title: string;
  content: string;
  coverImage?: string;
  authorId: Types.ObjectId | string;
  category: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategory {
  _id?: string;
  name: string;
  description?: string;
}

export interface ISubscriber {
  _id?: string;
  email: string;
  subscribedOn: Date;
}

export interface IResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
