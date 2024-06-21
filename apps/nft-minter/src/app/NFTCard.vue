<script setup lang="ts">
import { ref } from 'vue'
import { ethers } from 'ethers'

import { Window } from 'types/window'
import ERC721AbiJSON from './ERC721.abi.json'

const emit = defineEmits(['transfer-completed'])

const props = defineProps({
  id: Number,
  name: String,
  description: String,
  image: String,
})

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS

const ethereumWindow = window as unknown as Window
const ethereum = ethereumWindow.ethereum
const ethereumProvider = new ethers.BrowserProvider(ethereum)

const showTransferModal = ref(false)
const transferPending = ref(false)
const transaction = ref(null)
const recipientAddress = ref('')

const handleShowTransferModal = () => {
  showTransferModal.value = true
}

const handleCloseTransferModal = () => {
  showTransferModal.value = false
}

const handleTransfer = async () => {
  transferPending.value = true

  const signer = await ethereumProvider.getSigner()

  const contract = new ethers.Contract(
    contractAddress,
    ERC721AbiJSON,
    signer
  )

  const tx = await contract.safeTransferFrom(signer.address, ethers.getAddress(recipientAddress.value), props.id)

  transaction.value = tx
  console.log('mintResult', tx)

  await tx.wait()

  emit('transfer-completed')

  transferPending.value = false
  transaction.value = tx
}

</script>

<style scoped>
.nft-card {
  background-color: white;
  border-radius: 1rem;
  padding: 1rem;
  margin: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  color: black;
}

img {
  max-width: 320px;
  height: 320px;
}

.heading {
  margin: 0;
  font-size: 1.4rem;
  line-height: 2rem;
  font-weight: bold;
}

.flex-row {
  display: flex;
  justify-content: space-between;
  margin: 0.5rem 0;
}

.flex-center {
  justify-content: center;
}

.button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  font-family: inherit;
  color: black;
  background-color: mediumturquoise;
  border-radius: 2rem;
  cursor: pointer;
}

.button-sm {
  padding: 0.5rem 1rem;
}

.button-secondary {
  background-color: lightgray;
}

.transfer-modal {
  background-color: rgba(0, 0, 0, 0.75);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.transfer-modal-body {
  width: 480px;
  height: 320px;
  background-color: white;
  border-radius: 1rem;
  padding: 2rem;
  color: black;
}

.transfer-modal-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.form-group {
  margin: 1rem 0;
}

.flex-grow {
  flex-grow: 1;
}

.etherscan-link {
  margin-top: 1rem;
  font-weight: bold;
}

label {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  font-weight: bold;
}

input {
  width: 100%;
  margin: 0.5rem 0;
  padding: 0.5rem 1.5rem;
  font-size: 1.2rem;
  font-family: inherit;
  border-radius: 2rem;
  border: 1px solid
}
</style>

<template>
  <div class="nft-card">
    <img :src="image" alt="NFT Image" />
    <div class="flex-row">
      <h4 class="heading">{{ name }}</h4>
      <button @click="handleShowTransferModal" class="button button-sm">Transfer</button>
    </div>

    <p>{{ description }}</p>
  </div>
  <div v-if="showTransferModal" class="transfer-modal">
    <div class="transfer-modal-body">
      <div v-if="transferPending" class="transfer-modal-content">
        <h4 class="heading">Transfer pending...</h4>
        <div class="flex-row">
          <button @click="handleCloseTransferModal" class="button button-secondary">Close</button>
          <a :href="`https://sepolia.etherscan.io/tx/${transaction.hash}}`" class="button">
            See on Etherscan
          </a>
        </div>
      </div>
      <div v-else-if="!transaction" class="transfer-modal-content">
        <h4 class="heading">Transfer NFT</h4>
        Transfer {{ name }} to another address
        <div class="form-group">
          <label>Recipient Address</label>
          <input v-model="recipientAddress" type="text" placeholder="0x..." />
        </div>
        <div class="flex-row">
          <button @click="handleCloseTransferModal" class="button button-secondary">Cancel</button>
          <button @click="handleTransfer" class="button">Confirm</button>
        </div>
      </div>
      <div v-else class="transfer-modal-content">
        <h4 class="heading">Transfer Complete!</h4>
        <div class="flex-row">
          <button @click="handleCloseTransferModal" class="button button-secondary">Close</button>
          <a :href="`https://sepolia.etherscan.io/tx/${transaction}}`" class="button">
            See on Etherscan
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
