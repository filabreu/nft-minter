<script setup lang="ts">
import { defineEmits, ref, onMounted, watch } from 'vue'

import { Window } from 'types/window';
import Button from '../ui/Button.vue'

const ethereumWindow = window as unknown as Window
const ethereum = ethereumWindow.ethereum

const address = ref(null)
const truncatedAddress = ref(null)
const emit = defineEmits(['wallet-connected'])

const checkConnection = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' });

  if (accounts.length) {
    address.value = accounts[0]
    await changeChain()
  }
}

const connectWallet = async () => {
  try {
    const accounts = await ethereum.request({
      "method": "eth_requestAccounts",
      "params": []
    });

    await changeChain()

    address.value = accounts[0]

    emit('wallet-connected')
  } catch (error) {
    console.error(error)
  }
}

const changeChain = () => (
  ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: '0xaa36a7' }],
  })
)

onMounted(() => {
  checkConnection()
})

watch(address, () => {
  if (address.value) {
    truncatedAddress.value = `${address.value.slice(0, 6)}...${address.value.slice(-4)}`
  }
})
</script>

<style scoped>
.connect-button {
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
}
</style>

<template>
  <div class="connect-button">
    <Button
      @click="connectWallet"
    >
      {{ truncatedAddress || 'Connect Wallet' }}
    </Button>
  </div>
</template>
