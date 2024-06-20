<script setup lang="ts">
import { ref } from 'vue'

import Collection from './Collection.vue';
import ConnectButton from './ConnectButton.vue';
import MintForm from './MintForm.vue';

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
</style>

<template>
  <div class="container">
    <div class="header">
      <h1 class="heading1 text-center">NFT Minter</h1>
      <ConnectButton @wallet-connected="handleWalletConnected" />
    </div>

    <div class="content">
      <Collection v-if="connected" />
      <MintForm v-if="connected" />
      <div v-else class="heading2">
        Connect your wallet to start
      </div>
    </div>
  </div>
</template>
