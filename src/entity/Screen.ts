import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { NewPixel } from "./NewPixel"
import { Cursor } from "./Cursor"

@Entity()
export class Screen {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    height: number

    @Column()
    width: number

    // if possible allow to keep the screen with the same ip address
    @Column()
    ip: string

    @Column({default: 0})
    lastPixel: number

    //grid stored in 1 dimensional array, each element of the array is a line of the grid
    //each value is encode with hexadecimal character
    // 0 -> 0 ... 9 -> 9
    // 10 -> a ... 15 -> f
    @Column('simple-array')
    grid: string[];

    @OneToMany(() => NewPixel, pixel => pixel.grid)
    pixels: NewPixel[];

    @OneToMany(() => Cursor, cursor => cursor.screen)
    cursors: Cursor[];
}