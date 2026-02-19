import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'text', nullable: true })
  refreshToken: string | null;

  //   @Column({ type: 'text', nullable: true })
  //   resetToken: string | null;

  //   @Column({ nullable: true, type: 'timestamptz' })
  //   resetTokenExpiry: Date | null;
}
