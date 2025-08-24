import mongoose, { Schema, Document, HydratedDocument } from 'mongoose';
import { IBlog } from '@/types';

export type IBlogDocument = HydratedDocument<IBlog>;
const blogSchema = new Schema<IBlogDocument>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  coverImage: {
    type: String,
    default: ''
  },
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

blogSchema.index({ category: 1, tags: 1, createdAt: -1 });

export const Blog = mongoose.model<IBlogDocument>('Blog', blogSchema);
