<script setup lang="ts">

</script>

<template>
  <div class="dev-view">
    <device-view wsUrl="ws://localhost:7910/scrcpy"></device-view>
  </div>
</template>

<style scoped>
  .dev-view {
    width: 100%;
    height: 100%;
    background-color: gray;
  }
</style>
