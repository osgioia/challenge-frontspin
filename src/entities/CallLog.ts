import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity()
export class CallLog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    path: string;

    @Column({ type: 'timestamp' })
    startTime: Date;

    @Column({ type: 'timestamp' })
    finishTime: Date;

    @Column()
    result: string;

    @CreateDateColumn()
    createdAt: Date;
}