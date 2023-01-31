import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm"
import { Cursor } from "./Cursor"
import { Screen } from "./Screen"

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

    @Column()
    previousColor: number


    @ManyToOne(() => Screen, (screen) => screen.pixels)
    grid: Screen;

    @ManyToOne(() => Cursor, (cursor) => cursor.pixels)
    cursor: Cursor;
}
