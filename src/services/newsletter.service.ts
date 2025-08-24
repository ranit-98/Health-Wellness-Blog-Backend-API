import { SubscriberRepository } from '../repositories/subscriber.repository';

export class NewsletterService {
  private subscriberRepository: SubscriberRepository;

  constructor() {
    this.subscriberRepository = new SubscriberRepository();
  }

  async subscribe(email: string) {
    // Check if already subscribed
    const existingSubscriber = await this.subscriberRepository.findByEmail(email);
    if (existingSubscriber) {
      throw new Error('Email already subscribed to newsletter');
    }

    return await this.subscriberRepository.create({ email });
  }

  async unsubscribe(email: string) {
    const subscriber = await this.subscriberRepository.findByEmail(email);
    if (!subscriber) {
      throw new Error('Email not found in subscribers');
    }

    await this.subscriberRepository.deleteById(subscriber._id);
    return { message: 'Successfully unsubscribed' };
  }

  async getAllSubscribers() {
    return await this.subscriberRepository.findMany();
  }
}
