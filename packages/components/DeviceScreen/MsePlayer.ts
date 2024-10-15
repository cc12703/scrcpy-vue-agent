import VideoConverter from "h264-converter";
import { Communicator } from "./Commu"
import { Player } from "./Player";



type Block = {
    start: number;
    end: number;
};


export class MsePlayer implements Player {

    private video: HTMLVideoElement
    private converter: VideoConverter;
    private comm: Communicator


    private sourceBuffer?: SourceBuffer;
    private waitUntilSegmentRemoved = false;
    private blocks: Block[] = [];
    private frames: Uint8Array[] = [];

    constructor(video: HTMLVideoElement, comm: Communicator) {
        this.video = video
        this.comm = comm
        this.converter = this.createConverter(video)

        

        video.muted = true;
        video.autoplay = true;
        video.setAttribute('muted', 'muted');
        video.setAttribute('autoplay', 'autoplay');
    }


    public init() {
        this.converter.play()
        this.comm.on("frame", (frame: Uint8Array) => {
            this.pushFrame(frame)
        })
    }


    public pushFrame(frame: Uint8Array): void {
        if (!this.checkForIFrame(frame)) {
            this.frames.push(frame);
        }
    }


    private checkForIFrame(frame: Uint8Array): boolean {
        this.sourceBuffer = this.converter.sourceBuffer
        if (this.isIFrame(frame)) {
            let start = 0;
            let end = 0;

            if (this.video.buffered && this.video.buffered.length) {
                start = this.video.buffered.start(0);
                end = this.video.buffered.end(0);
            }
            if (end !== 0 && start < end) {
                const block: Block = {
                    start,
                    end,
                };
                this.blocks.push(block);
                if (this.blocks.length > 10) {
                    this.waitUntilSegmentRemoved = true;

                    this.sourceBuffer.addEventListener('updateend', this.cleanSourceBuffer);
                    this.converter.appendRawData(frame);
                    return true;
                }
            }
        }

        if (this.waitUntilSegmentRemoved) {
            return false;
        }

        this.converter.appendRawData(frame);
        return true
    }



    private cleanSourceBuffer() {
        if (!this.sourceBuffer) {
            return;
        }
        if (this.sourceBuffer.updating) {
            return;
        }
        if (this.blocks.length < 10) {
            return;
        }
        try {
            this.sourceBuffer.removeEventListener('updateend', this.cleanSourceBuffer);
            this.waitUntilSegmentRemoved = false;
            const removeStart = this.blocks[0].start;
            const removeEnd = this.blocks[4].end;
            this.blocks = this.blocks.slice(5);
            this.sourceBuffer.remove(removeStart, removeEnd);
            let frame = this.frames.shift();
            while (frame) {
                if (!this.checkForIFrame(frame)) {
                    this.frames.unshift(frame);
                    break;
                }
                frame = this.frames.shift();
            }
        } catch (error: any) {
            console.error('Failed to clean source buffer');
        }
    }

    private createConverter(video: HTMLVideoElement): VideoConverter {
        return new VideoConverter(video, 60, 1);
    } 


    private isIFrame(frame: Uint8Array): boolean {
        return frame && frame.length > 4 && (frame[4] & 31) === 5;
    }

}