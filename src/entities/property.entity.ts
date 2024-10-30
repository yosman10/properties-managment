import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('property')
export class PropertyEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column()
  area: number;

  @Column({ name: 'owner_id' })
  ownerId: number;
}
