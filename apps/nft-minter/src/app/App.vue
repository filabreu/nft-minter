<script setup lang="ts">
import { ref } from 'vue'

import ConnectButton from './ConnectButton.vue';

const connected = ref(false)

const handleWalletConnected = () => {
  connected.value = true
}
</script>

<style>
body {
  background-color: black;
  color: whitesmoke;
}

.heading1 {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
}

.heading2 {
  margin-bottom: 1.8rem;
  font-size: 1.8rem;
  font-weight: bold;
}

.heading3 {
  margin-bottom: 1.6rem;
  font-size: 1.6rem;
  font-weight: bold;
}

.heading4 {
  margin-bottom: 1.4rem;
  font-size: 1.4rem;
  font-weight: bold;
}

.text-center {
  text-align: center;
}
</style>

<style scoped>
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  width: 100%;
  margin: 2.5rem 0;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
}

.button {
  padding: 0.75rem 2rem;
  line-height: 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  font-family: inherit;
  color: black;
  background-color: mediumturquoise;
  border-radius: 2rem;
  cursor: pointer;
}

nav {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 4rem;
}
</style>

<template>
  <div class="container">
    <div class="header">
      <h1 class="heading1 text-center">NFT Minter</h1>
      <ConnectButton @wallet-connected="handleWalletConnected" />
    </div>

    <nav v-if="connected">
      <RouterLink to="/" class="button">Collection</RouterLink>
      <RouterLink to="/mint" class="button">Mint your NFT</RouterLink>
    </nav>
    <div class="content">
      <RouterView v-if="connected" />
      <div v-else class="heading2">
        Connect your wallet to start
      </div>
    </div>
  </div>
</template>
