import {
  Document,
  Model,
  FilterQuery,
  QueryOptions,
  HydratedDocument,
  UpdateQuery,
} from "mongoose";

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<HydratedDocument<T>> {
    const document = new this.model(data);
    return await document.save();
  }

  async findById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findById(id);
  }

  async findOne(
    filter: FilterQuery<T>,
    options?: QueryOptions
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findOne(filter, null, options);
  }

  async findMany(
    filter: FilterQuery<T> = {},
    options: QueryOptions = {}
  ): Promise<HydratedDocument<T>[]> {
    return this.model.find(filter, null, options);
  }

  async updateById(
    id: string,
    data: UpdateQuery<T>
  ): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async deleteById(id: string): Promise<HydratedDocument<T> | null> {
    return this.model.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }
}
