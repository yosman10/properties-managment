import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('owner')
export class OwnerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  names: string;

  @Column()
  surnames: string;

  @Column()
  active: boolean;
}
