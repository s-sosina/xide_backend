import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from 'typeorm';
import { UserRole } from '../../../common/enums/user-role.enum';
import { EmployerProfile } from '../../employers/entities/employer-profile.entity';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    default: true,
  })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => EmployerProfile, (employerProfile) => employerProfile.user)
  employerProfile: EmployerProfile;
}
