

import Emittery from "emittery";


export class Communicator {

    private wsUrl: string;

    private ws: WebSocket|null = null;

    private emitter = new Emittery();

    constructor(wsUrl: string) {
        this.wsUrl = wsUrl;
    }



    start() {
        this.ws = new WebSocket(this.wsUrl);
        this.ws.onopen = () => {
            console.log("ws opened");
        }
        this.ws.onclose = () => {
            console.log("ws closed");
        }
        this.ws.onmessage = (event) => {
            this.processMessage(event)
        }
    }

    stop() {
        this.ws?.close()
    }


    on(event: string, fn: (...args: any[]) => void) {
        this.emitter.on(event, fn);
    }

    off(event: string, fn: (...args: any[]) => void) {
        this.emitter.off(event, fn);
    }


    private processMessage(event: MessageEvent) {
        if (event.data instanceof ArrayBuffer) {    
            this.emitter.emit("frame", event.data);
        }
    }

}