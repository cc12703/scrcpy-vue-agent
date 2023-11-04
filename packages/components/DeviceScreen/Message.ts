


export class Message {

    constructor(readonly type: string) {}


    public toJSON() {
        return {
            type: this.type,
        };
    }
}



export const TOUCH_MSG_OPER_DOWN = "down";
export const TOUCH_MSG_OPER_UP = "up";
export const TOUCH_MSG_OPER_MOVE = "move";


export class TouchMessage extends Message {

    constructor(
        readonly oper: string, 
        readonly id: number,
        readonly x: number,
        readonly y: number,
        readonly scrnWidth: number,
        readonly scrnHeight: number,
        readonly pressure: number,
    ) {
        super("touch")
    }


    public toJSON() {
        return {
            type: this.type,
            oper: this.oper,
            id: this.id,
            x: this.x,
            y: this.y,
            scrnWidth: this.scrnWidth,
            scrnHeight: this.scrnHeight,
            pressure: this.pressure,
        }
    }
}