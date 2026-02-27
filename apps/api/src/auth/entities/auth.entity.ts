import { Exclude } from 'class-transformer';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('auth_providers')
export class AuthProvider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['local', 'google'],
  })
  provider: 'local' | 'google';

  @Column({ type: 'varchar', nullable: true })
  provider_id: string;

  @Exclude()
  @Column({ type: 'varchar', nullable: true })
  password: string;

  @ManyToOne(() => User, (user) => user.authProviders, {
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
