

import { Communicator } from './Commu'
import { TouchMessage, TOUCH_MSG_OPER_DOWN, TOUCH_MSG_OPER_MOVE, TOUCH_MSG_OPER_UP } from './Message'


class RectInfo {
    x = 0
    y = 0
    w = 0
    h = 0
}


export class Toucher {


    private canvas: HTMLCanvasElement
    private comm: Communicator

    private scrnRect: RectInfo = new RectInfo()
    private canvasRect: RectInfo = new RectInfo()

    constructor(canvas: HTMLCanvasElement, comm: Communicator) {
        this.canvas = canvas
        this.comm = comm
    }


    public init() {
        this.canvas.addEventListener('mousedown', this.onMouseDown)
    }

    private onMouseDown = (event: MouseEvent) => {
        event.preventDefault()

        this.calcRects()
        this.sendTouchMsg(TOUCH_MSG_OPER_DOWN, event, 0)


        this.canvas.addEventListener('mousemove', this.onMouseMove)
        document.addEventListener('mouseup', this.onMouseUp)
    }

    private onMouseMove = (event: MouseEvent) => {
        //排除右键
        if(event.button === 2)
            return

        event.preventDefault()

        this.sendTouchMsg(TOUCH_MSG_OPER_MOVE, event, 1)
    }

    private onMouseUp = (event: MouseEvent) => {
        //排除右键
        if(event.button === 2)
            return

        event.preventDefault()

        this.sendTouchMsg(TOUCH_MSG_OPER_UP, event, 0)

        this.canvas.removeEventListener('mousemove', this.onMouseMove)
        document.removeEventListener('mouseup', this.onMouseUp)
    }



  


    private sendTouchMsg(oper: string, event: MouseEvent, pressure: number) {
        const x = Math.round((event.pageX - this.scrnRect.x) / this.scrnRect.w * this.canvasRect.w)
        const y = Math.round((event.pageY - this.scrnRect.y) / this.scrnRect.h * this.canvasRect.h)
        const msg = new TouchMessage(oper, 0, x, y,
                    this.canvasRect.w, this.canvasRect.h, pressure)
        this.comm.sendMsg(msg)
    }




    private calcRects(): void {
        let el: HTMLElement = this.canvas
        this.scrnRect.x = 0
        this.scrnRect.y = 0
        this.scrnRect.w = el.offsetWidth
        this.scrnRect.h = el.offsetHeight

        while (el.offsetParent) {
            this.scrnRect.x += el.offsetLeft
            this.scrnRect.y += el.offsetTop
            el = el.offsetParent as HTMLElement
        }

        this.canvasRect.w = this.canvas.width
        this.canvasRect.h = this.canvas.height
    }

}
    