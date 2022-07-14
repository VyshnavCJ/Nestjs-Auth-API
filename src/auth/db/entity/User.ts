import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  username: string;

  @Column({
    name: 'email_id',
    type: 'varchar',
    length: 30,
    unique: true,
    nullable: false,
  })
  emailAddress: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: false,
  })
  password: string;

  @Column({
    name: 'phone',
    type: 'bigint',
    unique: true,
    nullable: false,
  })
  phoneNo: number;
}
