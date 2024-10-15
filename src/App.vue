

<template>
  <div class="dev-view">
    <device-screen :is-enable="isOn" :atx-agent-port="7912" way="mse"></device-screen>
  </div>
  <button type="button" @click="isOn = !isOn">{{ isOn? "关闭" : "打开" }}</button>
</template>



<script setup lang="ts">
import { ref } from 'vue';



const isOn = ref(false)

</script>

<style scoped>
  .dev-view {
    width: 50vw;
    height: 90vh;
    background-color: white;
  }
</style>
