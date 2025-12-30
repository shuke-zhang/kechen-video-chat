<script setup lang="ts">
import ChatInput from './components/chatInput.vue'

const inputValue = ref('shb')
</script>

<template>
  <div class="app-container">
    工单
    <ChatInput v-model="inputValue" />
  </div>
</template>

<style scoped lang="scss">
</style>
