<script setup lang="ts">
import { ref, watch } from 'vue'
import { ethers } from 'ethers'
import axios from 'axios';

import { Window } from 'types/window';
import Button from '../ui/Button.vue'
import ERC721AbiJSON from './ERC721.abi.json'
import FileSelect from './FileSelect.vue'

const fileUrl = ref(null)
const name = ref('')
const description = ref('')
const mintAllowed = ref(false)
const mintError = ref(false)
const mintSuccess = ref(false)

const ethereumWindow = window as unknown as Window
const ethereum = ethereumWindow.ethereum
const ethereumProvider = new ethers.BrowserProvider(ethereum)

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS
const apiHost = import.meta.env.VITE_API_HOST

const handleFileUploaded = (newFileUrl) => {
  fileUrl.value = newFileUrl
}

const mint = async () => {
  if (!mintAllowed.value) {
    return
  }

  mintAllowed.value = false

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

    console.log('mintResult', tx)

    await tx.wait()

    console.log('mintResult', tx)

    fileUrl.value = null
    name.value = ''
    description.value = ''
    mintSuccess.value = true
  } catch (error) {
    console.error(error)
    mintAllowed.value = true
  }
}

watch([fileUrl, name, description], () => {
  mintAllowed.value = !!fileUrl.value && name.value !== '' && description.value !== ''
})
</script>

<style scoped>
hr {
  width: 100%;
  border-top: 1px solid whitesmoke;
}

.label {
  display: block;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  font-size: 1.4rem;
  font-weight: bold;
  border-bottom: 1px solid whitesmoke;
}

.form {
  margin-top: 4rem;
}

.form-group {
  margin-bottom: 2rem;

  input, textarea {
    width: 100%;
    margin: 0.5rem 0;
    padding: 0.5rem 1.5rem;
    font-size: 1.2rem;
    font-family: inherit;
  }

  input {
    border-radius: 2rem;
  }

  textarea {
    border-radius: 1rem;
  }
}

.file-url {
  margin-top: 1rem;
}
</style>

<template>
  <div class="mint-form">
    <h1 class="heading1">Mint your NFT</h1>
    <h4 class="heading4">Upload an image file and input name and description metadata to mint your NFT</h4>
    <hr />
    <div class="form">
      <div class="form-group">
        <label class="label">
          Select an image
        </label>
        <FileSelect @file-uploaded="handleFileUploaded" />
        <div v-if="fileUrl" class="file-url">
          {{ fileUrl }}
        </div>
      </div>
      <div class="form-group">
        <label class="label">
          Name
        </label>
        <input type="text" v-model="name" placeholder="Name" />
      </div>
      <div class="form-group">
        <label class="label">
          Description
        </label>
        <textarea v-model="description" placeholder="Description" rows="5" />
      </div>
      <div v-if="mintError">
        Error minting token<br />
        Upload a file and fill out the name and description fields
      </div>
      <Button @click="mint" :disabled="!mintAllowed" class="button">
        Mint new Token
      </Button>
    </div>
  </div>
</template>
