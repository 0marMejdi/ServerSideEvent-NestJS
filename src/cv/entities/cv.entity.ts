import { CvEvent } from 'src/sse/entity/sseEntity.entity';
import { User } from '../../auth/entities/user.entity';
import { TimeStampEntities } from '../../generics/timestamps.entites';
import { Skill } from '../../skill/entities/skill.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('cv')
export class Cv extends TimeStampEntities {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  firstname: string;
  @Column()
  age: number;
  @Column()
  cin: number;
  @Column()
  job: string;
  @Column()
  path: string;
  @ManyToOne((type) => User, (user) => user.cvs, {
    cascade: ['insert', 'update'],
    nullable: true,
    eager: true,
  })
  user: User;
  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];
  //cvevent
  @OneToMany(() => CvEvent, (cvEvent) => cvEvent.cv)
  cvEvents: CvEvent[];

}
