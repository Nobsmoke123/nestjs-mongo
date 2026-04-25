import { NotFoundException } from '@nestjs/common';
import { Document, Model, QueryFilter, UpdateQuery } from 'mongoose';

export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  async findOne(
    entityFilterQuery: QueryFilter<T>,
    projection: Record<string, unknown>,
  ): Promise<T> {
    const record = await this.entityModel
      .findOne(entityFilterQuery, {
        ...projection,
      })
      .exec();

    if (!record) {
      throw new NotFoundException('Record not found.');
    }

    return record;
  }

  async find(entityFilterQuery: QueryFilter<T>): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery);
  }

  async create(createEntityDto: Partial<T>): Promise<T> {
    const entity = await this.entityModel.create(createEntityDto);
    return entity;
  }

  async findOneAndUpdate(
    entityFilterQuery: QueryFilter<T>,
    updateEntityData: UpdateQuery<Partial<T>>,
  ): Promise<T> {
    const record = await this.entityModel.findOneAndUpdate(
      entityFilterQuery,
      updateEntityData,
      { returnDocument: 'after' },
    );

    if (!record) {
      throw new NotFoundException('Record not found.');
    }

    return record;
  }

  async deleteMany(entityFilterQuery: QueryFilter<T>): Promise<boolean> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount >= 1;
  }
}
