

import NALU from 'h264-converter/dist/util/NALU';


import * as EncodeUtils from './EncodeUtils';
import { Communicator } from './Commu'


type DecodedFrame = {
    width: number;
    height: number;
    frame: any;
}

enum PlayState {
    PLAYING = 1,
    PAUSED,
    STOPPED,
}


export class Player {

    private canvas: HTMLCanvasElement
    private canvasCtx: CanvasRenderingContext2D
    private decoder: VideoDecoder
    private comm: Communicator

    private animationFrameId?: number

    private state: PlayState = PlayState.PLAYING
    private frames: Uint8Array[] = []
    private decodedFrames: DecodedFrame[] = []
    private receivedFirstFrame = false

    private buffer: ArrayBuffer | undefined;
    private hadIDR = false;
    private bufferedSPS = false;
    private bufferedPPS = false;


    constructor(canvas: HTMLCanvasElement, comm: Communicator) {
        this.canvas = canvas
        this.canvasCtx = canvas.getContext('2d')!!
        this.decoder = this.createDecoder()
        this.comm = comm
        
    }

    public init() {
        this.comm.on("frame", (frame: Uint8Array) => {
            this.pushFrame(frame)
        })
    }


    public pushFrame(frame: Uint8Array): void {
        if (!this.receivedFirstFrame) {
            this.receivedFirstFrame = true;
        }

        
        this.frames.push(frame);
        this.shiftFrame();
    }


    private shiftFrame(): void {
        if (this.state !== PlayState.PLAYING)
            return;
        
        const first = this.frames.shift();
        if (first) {
            this.decodeFrame(first);
        }
    }


    private decodeFrame(data: Uint8Array): void {
        if (!data || data.length < 4) {
            return;
        }
        const type = data[4] & 31;
        const isIDR = type === NALU.IDR;
        if (type === NALU.SPS) {
            const { codec, width, height } = EncodeUtils.parseSPS(data.subarray(4));
            console.log(`config player by SPS: ${codec}, ${width}, ${height}`)

            this.canvas.width = width
            this.canvas.height = height


            const config: VideoDecoderConfig = {
                codec,
                optimizeForLatency: true,
            } as VideoDecoderConfig;
            this.decoder.configure(config);
            this.bufferedSPS = true;
            
            this.addFrameToBuffer(data);
            this.hadIDR = false;
            return;
        } else if (type === NALU.PPS) {
            this.bufferedPPS = true;
            this.addFrameToBuffer(data);
            return;
        } else if (type === NALU.SEI) {
            // Workaround for lonely SEI from ws-qvh
            if (!this.bufferedSPS || !this.bufferedPPS) {
                return;
            }
        }
        const array = this.addFrameToBuffer(data);
        this.hadIDR = this.hadIDR || isIDR;
        if (array && this.decoder.state === 'configured' && this.hadIDR) {
            this.buffer = undefined;
            this.bufferedPPS = false;
            this.bufferedSPS = false;
            this.decoder.decode(
                new EncodedVideoChunk({
                    type: 'key',
                    timestamp: 0,
                    data: array.buffer,
                }),
            );
            return;
        }
    }



    private addFrameToBuffer(data: Uint8Array): Uint8Array {
        let array: Uint8Array;
        if (this.buffer) {
            array = new Uint8Array(this.buffer.byteLength + data.byteLength);
            array.set(new Uint8Array(this.buffer));
            array.set(new Uint8Array(data), this.buffer.byteLength);
        } else {
            array = data;
        }
        this.buffer = array.buffer;
        return array;
    }


    private createDecoder(): VideoDecoder {
        return new VideoDecoder({
            output: (frame) => {
                this.onFrameDecoded(0, 0, frame);
            },
            error: (error: DOMException) => {
                console.error(error, `code: ${error.code}`);
            },
        });
    }





    private onFrameDecoded(width: number, height: number, frame: any): void {
        if (!this.receivedFirstFrame)
            return;
        

        this.decodedFrames.push({ width, height, frame });
        

        if (!this.animationFrameId) {
            this.animationFrameId = requestAnimationFrame(this.drawDecoded);
        }
    }


    drawDecoded = (): void => {
        if (this.receivedFirstFrame) {
            const data = this.decodedFrames.shift();
            if (data) {
                const frame: VideoFrame = data.frame;
                this.canvasCtx.drawImage(frame, 0, 0);
                frame.close();
            }
        }

        if (this.decodedFrames.length) {
            this.animationFrameId = requestAnimationFrame(this.drawDecoded);
        } else {
            this.animationFrameId = undefined;
        }
    }



}