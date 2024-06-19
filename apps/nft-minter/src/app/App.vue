<script setup lang="ts">
import { onMounted, ref } from 'vue'

import Collection from './Collection.vue';
import ConnectButton from './ConnectButton.vue';
import MintForm from './MintForm.vue';

import { Window } from 'types/window';

const ethereumWindow = window as unknown as Window
const ethereum = ethereumWindow.ethereum

const connected = ref(false)

const checkConnection = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' });

  if (accounts.length) {
    await handleConnectWallet()
  }
}

const connectWallet = async () => {
  try {
    await ethereum.request({
      "method": "eth_requestAccounts",
      "params": []
    });

    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }],
    })
  } catch (error) {
    console.error(error)
  }

  connected.value = true
}

onMounted(() => {
  checkConnection()
})

const handleConnectWallet = async () => {
  await connectWallet()
}
</script>

<template>
  <h1>NFT Minter</h1>
  <h3 v-if="connected">Welcome!</h3>
  <Collection v-if="connected" />
  <ConnectButton v-else @connect-wallet="handleConnectWallet" />
  <MintForm v-if="connected" />
</template>
