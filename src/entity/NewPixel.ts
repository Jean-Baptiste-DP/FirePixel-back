import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class NewPixel {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    date: Date

    @Column()
    positionX: number

    @Column()
    positionY: number

    @Column()
    color: number

}
