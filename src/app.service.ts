import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PropertyEntity } from './entities/property.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OwnerEntity } from './entities/OnwerEntity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
    @InjectRepository(OwnerEntity)
    private ownerRepository: Repository<OwnerEntity>,
  ) {}

  async get_prop_by_id(id: number): Promise<PropertyEntity> {
    const result = await this.propertyRepository
      .createQueryBuilder('property')
      .select('property.name', 'name')
      .addSelect('property.location', 'location')
      .addSelect('property.country', 'country')
      .addSelect('property.city', 'city')
      .addSelect('property.area', 'area')
      .addSelect('owner.names', 'names')
      .addSelect('owner.surnames', 'surnames')
      .innerJoin(OwnerEntity, 'owner', 'owner.id = property.owner_id')
      .where('property.id = :id', { id })
      .getOne();
    return result;
  }

  createProp(property: any) {
    if (typeof property.name != 'string') {
      throw new BadRequestException('Nombre de la propiedad invalida');
    }
    if (typeof property.location != 'string') {
      throw new BadRequestException('Dirección de la propiedad invalida');
    }
    if (typeof property.country != 'string') {
      throw new BadRequestException('pAIS de la propiedad invalido');
    }
    if (typeof property.city != 'string') {
      throw new BadRequestException('Ciudad de la propiedad invalida');
    }
    if (typeof property.area != 'number') {
      throw new BadRequestException('Area de la propiedad invalida');
    }
    if (typeof property.ownerId != 'number') {
      throw new BadRequestException('Propietario de la propiedad invalido');
    }
    return this.propertyRepository.save(property);
  }

  async processProp(id: number, property: any): Promise<any> {
    property.id = id;
    if (
      typeof property.name != 'string' &&
      typeof property.name != 'undefined'
    ) {
      throw new BadRequestException('Nombre de la propiedad invalida');
    }
    if (
      typeof property.location != 'string' &&
      typeof property.location != 'undefined'
    ) {
      throw new BadRequestException('Dirección de la propiedad invalida');
    }
    if (
      typeof property.country != 'string' &&
      typeof property.country != 'undefined'
    ) {
      throw new BadRequestException('Pais de la propiedad invalido');
    }
    if (
      typeof property.city != 'string' &&
      typeof property.city != 'undefined'
    ) {
      throw new BadRequestException('Ciudad de la propiedad invalida');
    }
    if (
      typeof property.area != 'number' &&
      typeof property.area != 'undefined'
    ) {
      throw new BadRequestException('Area de la propiedad invalida');
    }
    if (
      typeof property.ownerId != 'number' &&
      typeof property.ownerId != 'undefined'
    ) {
      throw new BadRequestException('Propietario de la propiedad invalido');
    }
    return await this.propertyRepository.query(
      `UPDATE property SET ${this.getSetsProps(property)} WHERE id = $1`,
      [id],
    );
  }

  public getSetsProps(property: {
    name: string;
    location: string;
    country: string;
    city: string;
    area: number;
    ownerId: number;
  }) {
    let set = '';
    if (property.name) {
      set += 'name=' + property.name;
    }
    if (property.location) {
      if (set.length > 0) {
        set += ', ';
      }
      set += 'location=' + property.location;
    }
    if (property.country) {
      if (set.length > 0) {
        set += ', ';
      }
      set += 'country=' + property.country;
    }
    if (property.city) {
      if (set.length > 0) {
        set += ', ';
      }
      set += 'city=' + property.city;
    }
    if (property.area) {
      if (set.length > 0) {
        set += ', ';
      }
      set += 'area=' + property.area;
    }
    if (property.ownerId) {
      if (set.length > 0) {
        set += ', ';
      }
      set += 'owner_id=' + property.ownerId;
    }
    return set;
  }

  deleteProp(id: number) {
    return this.propertyRepository.delete(id);
  }

  async getOwnerById(id: number): Promise<OwnerEntity> {
    const result = await this.ownerRepository
      .createQueryBuilder('owner')
      .select('owner.names', 'names')
      .addSelect('owner.surnames', 'surnames')
      .where('owner.id = :id', { id })
      .execute();
    if (result == null || result == undefined || result.length < 1) {
      throw new NotFoundException('Propietario no encontrado');
    }
    return result[0];
  }

  createOwner(owner: { names: string; surnames: string }) {
    if (typeof owner.names != 'string') {
      throw new BadRequestException('Nombres del propietario invalidos');
    }
    if (typeof owner.surnames != 'string') {
      throw new BadRequestException('Apellidos del propietario invalidos');
    }
    return this.ownerRepository.save(owner);
  }

  updateOwner(id: number, owner: any) {
    if (typeof owner.names != 'string' && typeof owner.names != 'undefined') {
      throw new BadRequestException('Nombres del propietario invalidos');
    }
    if (
      typeof owner.surnames != 'string' &&
      typeof owner.surnames != 'undefined'
    ) {
      throw new BadRequestException('Apellidos del propietario invalidos');
    }
    owner.id = id;
    return this.ownerRepository.save(owner);
  }

  async deleteOwner(id: number): Promise<any> {
    const owner = await this.getOwnerById(id);
    owner.active = false;
    return this.propertyRepository.save(owner);
  }

  getAll() {
    return this.ownerRepository.find();
  }
}
