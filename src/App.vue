<script setup lang="ts">

</script>

<template>
  <div class="dev-view">
    <DeviceView wsUrl="ws://localhost:7910/scrcpy"></DeviceView>
  </div>
</template>

<style scoped>
  .dev-view {
    width: 100%;
    height: 100%;
    background-color: #000;
  }
</style>
