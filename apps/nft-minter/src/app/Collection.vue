<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ethers } from 'ethers'

import ERC721AbiJSON from './ERC721.abi.json'
import { Window } from 'types/window';

const contractAddress = '0xbd51fa4057ef8bd493bd042b310d2b1562d8daa0'
const walletAddress = ref<string | null>(null)
const ownedTokens = ref<number[]>([])

const ethereumWindow = window as unknown as Window
const ethereum = ethereumWindow.ethereum

const contract = new ethers.Contract(
  contractAddress,
  ERC721AbiJSON,
  new ethers.BrowserProvider(ethereum)
)

const getWalletAddress = async () => {
  const accounts = await ethereum.request({ method: 'eth_accounts' });

  if (accounts) {
    console.log(accounts)
    walletAddress.value = accounts[0]
  }
}

const getOwnedTokens = async () => {
  try {
    const balance = parseInt(await contract.balanceOf(walletAddress.value))

    console.log('balance', balance)

    const collectionIndexes = balance > 0 ? Array.from(Array(balance - 1).keys()) : []

    if (balance > 0) {
      ownedTokens.value = await Promise.all(
        collectionIndexes.map((i) => contract.tokenOfOwnerByIndex(walletAddress.value, i))
      )
    }
    console.log(collectionIndexes)
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

<template>
  <h1>Collection</h1>
  <p>Wallet Address: {{ walletAddress }}</p>
</template>
