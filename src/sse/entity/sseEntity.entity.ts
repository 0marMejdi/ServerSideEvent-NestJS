// cv-event.entity.ts


import { Cv } from 'src/cv/entities/cv.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CvEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string; // e.g., 'create', 'update', 'delete'

  @Column()
  date: Date;

  @ManyToOne(() => Cv)
  cv: Cv;

  // Add more fields as needed, such as user, description, etc.
}
