import mongoose, { Schema, Document, HydratedDocument } from 'mongoose';
import { ISubscriber } from '@/types';

export type ISubscriberDocument = HydratedDocument<ISubscriber>;
const subscriberSchema = new Schema<ISubscriberDocument>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  subscribedOn: {
    type: Date,
    default: Date.now
  }
});

export const Subscriber = mongoose.model<ISubscriberDocument>('Subscriber', subscriberSchema);
