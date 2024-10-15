

import { Communicator } from './Commu'
import { TouchMessage, TOUCH_MSG_OPER_DOWN, TOUCH_MSG_OPER_MOVE, TOUCH_MSG_OPER_UP } from './Message'


class RectInfo {
    x = 0
    y = 0
    w = 0
    h = 0
}


export class Toucher {


    private dispView: HTMLElement
    private comm: Communicator

    private scrnRect: RectInfo = new RectInfo()
    private dispViewRect: RectInfo = new RectInfo()

    constructor(dispView: HTMLElement, comm: Communicator) {
        this.dispView = dispView
        this.comm = comm
    }


    public init() {
        this.dispView.addEventListener('mousedown', this.onMouseDown)
    }

    private onMouseDown = (event: MouseEvent) => {
        event.preventDefault()

        this.calcRects()
        this.sendTouchMsg(TOUCH_MSG_OPER_DOWN, event, 0)


        this.dispView.addEventListener('mousemove', this.onMouseMove)
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

        this.dispView.removeEventListener('mousemove', this.onMouseMove)
        document.removeEventListener('mouseup', this.onMouseUp)
    }



  


    private sendTouchMsg(oper: string, event: MouseEvent, pressure: number) {
        const x = Math.round((event.pageX - this.scrnRect.x) / this.scrnRect.w * this.dispViewRect.w)
        const y = Math.round((event.pageY - this.scrnRect.y) / this.scrnRect.h * this.dispViewRect.h)
        const msg = new TouchMessage(oper, 0, x, y,
                    this.dispViewRect.w, this.dispViewRect.h, pressure)
        this.comm.sendMsg(msg)
    }




    private calcRects(): void {
        let el: HTMLElement = this.dispView
        this.scrnRect.x = 0
        this.scrnRect.y = 0
        this.scrnRect.w = el.offsetWidth
        this.scrnRect.h = el.offsetHeight

        while (el.offsetParent) {
            this.scrnRect.x += el.offsetLeft
            this.scrnRect.y += el.offsetTop
            el = el.offsetParent as HTMLElement
        }



        if (this.dispView instanceof HTMLCanvasElement) {
            this.dispViewRect.w = this.dispView.width
            this.dispViewRect.h = this.dispView.height
        }
        else if (this.dispView instanceof HTMLVideoElement) {
            this.dispViewRect.w = this.dispView.videoWidth
            this.dispViewRect.h = this.dispView.videoHeight
        }

    }

}
    