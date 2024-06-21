 <script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import axios from 'axios';
import { ethers } from 'ethers';

import { Window } from 'types/window';
import NFTCard from './NFTCard.vue';

interface TokenMetadata {
  name: string;
  description: string;
  image: string;
}

interface Token {
  id: number;
  metadata: TokenMetadata;
}

const apiHost = import.meta.env.VITE_API_HOST

const walletAddress = ref<string | null>(null)
const ownedTokens = ref<Token[]>([])

const ethereumWindow = window as unknown as Window
const ethereum = ethereumWindow.ethereum

const getWalletAddress = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' });

  if (accounts) {
    walletAddress.value = ethers.getAddress(accounts[0])
  }
}

const getOwnedTokens = async () => {
  try {
    const { data: { tokens } } = await axios.get(`${apiHost}/owners/${walletAddress.value}/tokens/metadata`)

    console.log('tokens', tokens)

    ownedTokens.value = tokens
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  getWalletAddress()
})

watch(walletAddress, () => {
  if (walletAddress.value) {
    getOwnedTokens()
  }
})
</script>

<style scoped>
.collection-grid {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.empty-collection {
  width: 100%;
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
</style>

<template>
  <div class="collection-grid">
    <NFTCard
      v-for="token in ownedTokens"
      :key="token.id"
      :id="token.id"
      :name="token.metadata.name"
      :description="token.metadata.description"
      :image="token.metadata.image"
      @transfer-completed="getOwnedTokens"
    />
    <div v-if="ownedTokens && ownedTokens.length === 0" class="empty-collection">
      Your collection is empty
    </div>
  </div>
</template>
