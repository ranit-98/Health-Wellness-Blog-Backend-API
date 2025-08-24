import { BaseRepository } from './base.repository';
import { Subscriber } from '../models/subscriber.model';

export class SubscriberRepository extends BaseRepository<any> {
  constructor() {
    super(Subscriber);
  }

  async findByEmail(email: string) {
    return await this.model.findOne({ email });
  }
}
