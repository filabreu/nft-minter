<script setup lang="ts">
import { ref } from 'vue'
import { ethers } from 'ethers'

import ERC721AbiJSON from './ERC721.abi.json'
import FileSelect from './FileSelect.vue'
import { Window } from 'types/window';
import axios from 'axios';

const fileUrl = ref(null)
const name = ref('')
const description = ref('')
const mintPending = ref(false)
const mintError = ref(false)
const mintSuccess = ref(false)

const ethereumWindow = window as unknown as Window
const ethereum = ethereumWindow.ethereum
const ethereumProvider = new ethers.BrowserProvider(ethereum)

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
const apiHost = import.meta.env.VITE_API_HOST ?? 'http://localhost:3333'

console.log('contractAddress', contractAddress)

const handleFileUploaded = (newFileUrl) => {
  fileUrl.value = newFileUrl
}

const mint = async () => {
  mintPending.value = true

  if (!fileUrl.value || name.value === '' || description.value === '') {
    mintPending.value = false
    return
  }

  try {
    const { data: { tokenURI } } = await axios.post(`${apiHost}/token-uri`, {
      name: name.value,
      description: description.value,
      image: fileUrl.value
    })

    const signer = await ethereumProvider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      ERC721AbiJSON,
      signer
    )

    const tx = await contract.mintNFT(signer.address, tokenURI)

    await tx.wait()

    console.log('mintResult', tx)

    mintPending.value = false
    mintSuccess.value = true
  } catch (error) {
    console.error(error)
    mintPending.value = false
  }
}
</script>

<template>
  <form>
    <FileSelect @file-uploaded="handleFileUploaded" />
    <label>
      Name
      <input type="text" v-model="name" placeholder="Name" />
    </label>
    <label>
      Description
      <input type="text" v-model="description" placeholder="Description" />
    </label>
    <div>
      <span v-if="fileUrl">File URL: {{ fileUrl }}</span>
    </div>
    <div v-if="mintError">
      Error minting token<br />
      Upload a file and fill out the name and description fields
    </div>
    <button @click="mint" :disabled="mintPending" class="button">
      Mint new Token
    </button>
  </form>
</template>
