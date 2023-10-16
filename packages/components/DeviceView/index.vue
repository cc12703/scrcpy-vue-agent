


<template>
    <canvas ref="container">

    </canvas>


</template>



<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Communicator } from './Commu.ts'
import { Player } from './Player.ts'



const container = ref<HTMLCanvasElement|null>(null)



const props = defineProps<{
    wsUrl: string
}>()

const comm = new Communicator(props.wsUrl)
const player = new Player(container.value!, comm)


onMounted(() => {
    console.log(`onMounted is call ${props.wsUrl}`)
    comm.start()
    
})










</script>./Commu.js./Player.js