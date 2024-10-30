import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AppService } from './app.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyEntity } from './entities/property.entity';

@Controller('app')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRepository(PropertyEntity)
    private propertyRepository: Repository<PropertyEntity>,
  ) {}

  @Get('all-props')
  getAllProps() {
    return this.propertyRepository.find();
  }

  @Get('prop/:id')
  getPropById(@Param('id') id: string) {
    return this.appService.get_prop_by_id(Number(id));
  }

  @Post('prop')
  createProp(@Body() property: any) {
    if (property.name == null) {
      throw new BadRequestException('El nombre es requerido');
    } else {
      if (property.location == null) {
        throw new BadRequestException('La dirección es requerida');
      } else {
        if (property.country == null) {
          throw new BadRequestException('El pais es requerido');
        } else {
          if (property.city == null) {
            throw new BadRequestException('La ciudad es requerida');
          } else {
            if (property.area == null) {
              throw new BadRequestException('La area es requerida');
            } else {
              if (property.ownerId == null) {
                throw new BadRequestException('La area es requerida');
              }
            }
          }
        }
      }
    }
    return this.appService.createProp(property);
  }

  @Put('update-prod/:id')
  async processProp(
    @Param('id') id: string,
    @Body()
    property: {
      name?: string;
      location?: string;
      countri?: string;
      citi: string;
      owner_id?: string;
    },
  ) {
    const prop = await this.appService.get_prop_by_id(Number(id));
    if (
      property.name == null &&
      property.location == null &&
      property.countri == null &&
      property.citi == null &&
      property.owner_id == null
    ) {
      throw new BadRequestException(
        'Debe enviar al menos un valor para actualizar',
      );
    } else {
      if (prop == null) {
        throw new NotFoundException('No se encontró la propiedad a actualizar');
      }
    }
    return this.appService.processProp(Number(id), property);
  }

  @Delete('delete-prop/:id')
  deleteProp(@Param('id') id: string) {
    return this.appService.deleteProp(Number(id));
  }

  @Get('all-owners')
  getAllOnwers() {
    return this.appService.getAll();
  }

  @Get('owner/:id')
  getOwnerById(@Param('id') id: string) {
    return this.appService.getOwnerById(Number(id));
  }

  @Post('owner')
  createOwner(@Body() owner: any) {
    if (owner.names == null) {
      throw new BadRequestException('Los nombres son requeridos');
    } else {
      if (owner.surnames == null) {
        throw new BadRequestException('El apellido es requerido');
      }
    }
    return this.appService.createOwner(owner);
  }

  @Put('update-owner/:id')
  async updateOwner(
    @Param('id') id: string,
    @Body()
    owner: {
      names?: string;
      surnames?: string;
    },
  ) {
    const owner_entity = await this.appService.getOwnerById(Number(id));
    if (owner.names == null && owner.surnames == null) {
      throw new BadRequestException(
        'Debe enviar al menos un valor para actualizar',
      );
    } else {
      if (owner_entity == null) {
        throw new NotFoundException(
          'No se encontró el propietario a actualizar',
        );
      }
    }
    return this.appService.updateOwner(Number(id), owner);
  }

  @Delete('delete-prop/:id')
  deleteOwner(@Param('id') id: string) {
    return this.appService.deleteOwner(Number(id));
  }
}
