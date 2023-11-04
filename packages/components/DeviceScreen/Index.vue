


<template>
    <div class="screen_root">
        <canvas ref="canvas" :style="canvasStyle" />
    </div>

</template>



<script setup lang="ts">
import { onMounted, ref, reactive, watch } from 'vue';

import { Communicator } from './Commu'
import { Player } from './Player'
import { Toucher } from './Toucher'



const canvas = ref<HTMLCanvasElement|null>(null)
const canvasStyle = reactive({
    opacity: 1,
    width: 'auto',
    height: '600px',
})


const props = defineProps<{
    atxAgentPort: number,
    isEnable: boolean
}>()

let comm: Communicator
let player: Player
let toucher: Toucher


onMounted(() => {
    console.log(`onMounted is call ${props.atxAgentPort}`)
    
    const wsUrl = `ws://${window.location.hostname}:${props.atxAgentPort}/scrcpy`
    comm = new Communicator(wsUrl)
    player = new Player(canvas.value!, comm)
    toucher = new Toucher(canvas.value!, comm)

    player.init()
    toucher.init()

    fitCanvas()

    
})

watch(() => props.isEnable, (newVal) => {
    if (newVal) {
        comm.start()
        canvasStyle.opacity = 1
    } else {
        comm.stop()
        canvasStyle.opacity = 0.5
    }
})


function fitCanvas() {
    if (canvas.value !== null) {
        canvasStyle.height = canvas.value!!.parentElement?.clientHeight + 'px'
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