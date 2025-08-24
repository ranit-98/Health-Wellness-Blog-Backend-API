import mongoose, { Schema, Document, HydratedDocument } from 'mongoose';
import { ICategory } from '@/types';

export type ICategoryDocument = HydratedDocument<ICategory>;
const categorySchema = new Schema<ICategoryDocument>({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});

export const Category = mongoose.model<ICategoryDocument>('Category', categorySchema);

