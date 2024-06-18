<script setup lang="ts">
import { defineEmits } from 'vue'

const emit = defineEmits(['connect-wallet'])

const connectWallet = () => {
  emit('connect-wallet')
}
</script>

<template>
  <a @click="connectWallet" class="button">Connect Wallet</a>
</template>
