import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from "typeorm"
import { NewPixel } from "./NewPixel"
import { Screen } from "./Screen"

@Entity()
export class Cursor {

    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    firstConnection: Date

    //if it's possible to store the ip address of the phone, or ++ the MAC address, it would be easier for moderation
    @Column()
    ip: string

    @Column()
    idCursor: number

    @ManyToOne(() => Screen, (screen) => screen.cursors)
    screen: Screen;

    @OneToMany(() => NewPixel, pixel => pixel.cursor)
    pixels : NewPixel[];
}