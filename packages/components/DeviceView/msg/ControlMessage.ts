


export class ControlMessage {
    public static TYPE_KEYCODE = 0;
    public static TYPE_TEXT = 1;
    public static TYPE_TOUCH = 2;
    public static TYPE_SCROLL = 3;

    constructor(readonly type: number) {}

    public toBuffer(): ArrayBuffer {
        throw Error('Not implemented');
    }
}