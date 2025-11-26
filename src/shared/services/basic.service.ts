import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export class BasicService<Entity extends ObjectLiteral> {
  constructor(protected repository: Repository<Entity>) {}

  find(...args: Parameters<Repository<Entity>['find']>) {
    return this.repository.find(...args);
  }
  findOne(...args: Parameters<Repository<Entity>['findOne']>) {
    return this.repository.findOne(...args);
  }
  findOneBy(...args: Parameters<Repository<Entity>['findOneBy']>) {
    return this.repository.findOneBy(...args);
  }
  findBy(where: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]) {
    return this.repository.findBy(where);
  }
  findAndCount(...args: Parameters<Repository<Entity>['findAndCount']>) {
    return this.repository.findAndCount(...args);
  }
  save(data: Entity) {
    return this.repository.save(data);
  }
  create(data: DeepPartial<Entity>) {
    return this.repository.save(this.repository.create(data));
  }
  update(...args: Parameters<Repository<Entity>['update']>) {
    return this.repository.update(...args);
  }
  count(...args: Parameters<Repository<Entity>['count']>) {
    return this.repository.count(...args);
  }
}
