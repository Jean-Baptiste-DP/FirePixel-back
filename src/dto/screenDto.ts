import { Cursor } from "../entity/Cursor";
import { NewPixel } from "../entity/NewPixel";

export class ScreenDTO {
    public height: number;
    public width: number;
    public ip: string
}

export class ScreenObj{
    id: number
    height: number
    width: number
    ip: string
    lastPixel: number
    grid: string[];
    pixels: NewPixel[];
    cursors: Cursor[];
}