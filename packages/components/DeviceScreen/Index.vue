


<template>
    <div class="screen_root">
        <canvas v-if="props.way == 'webc'" ref="dispView" :style="dispViewStyle" />
        <video v-else-if="props.way == 'mse'" ref="dispView" :style="dispViewStyle" />
    </div>

</template>



<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';

import { Communicator } from './Commu'
import { WebCPlayer } from './WebCPlayer'
import { Toucher } from './Toucher'
import { Player } from './Player';
import { MsePlayer } from './MsePlayer';



const dispView = ref<HTMLElement|null>(null)
const dispViewStyle = reactive({
    opacity: 1,
    width: 'auto',
    height: '600px',
})


const props = defineProps<{
    atxAgentPort: number,
    isEnable: boolean,
    way: string,  //mse or webc
}>()

let comm: Communicator
let player: Player
let toucher: Toucher


onMounted(() => {
    console.log(`onMounted is call ${props.atxAgentPort}`)
    
    const wsUrl = `ws://${window.location.hostname}:${props.atxAgentPort}/scrcpy`
    comm = new Communicator(wsUrl)
    toucher = new Toucher(dispView.value!, comm)

    if (props.way === 'mse') {
        player = new MsePlayer((dispView.value as HTMLVideoElement)!, comm)
    }
    else if (props.way === 'webc') {
        player = new WebCPlayer((dispView.value as HTMLCanvasElement)!, comm)
    }


    player.init()
    toucher.init()

    if (props.isEnable) {
        comm.start()
    }

    fitCanvas()

    
})

watch(() => props.isEnable, (newVal) => {
    if (newVal) {
        comm.start()
        dispViewStyle.opacity = 1
    } else {
        comm.stop()
        dispViewStyle.opacity = 0.5
    }
})


function fitCanvas() {
    if (dispView.value !== null) {
        dispViewStyle.height = dispView.value!!.parentElement?.clientHeight + 'px'
        dispViewStyle.width = 'auto'
    }
}



</script>

<style scoped>
.screen_root {
    width: 100%;
    height: 100%;
    background-color: gray;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    overflow:auto;
}
</style>