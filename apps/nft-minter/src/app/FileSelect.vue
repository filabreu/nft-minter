<script setup lang="ts">
import { defineEmits } from "vue"
import axios from 'axios';

const apiHost = import.meta.env.VITE_API_HOST

const emit = defineEmits(['file-uploaded'])

const handleFileChange = (e) => {
  const formData = new FormData()
  formData.append('file', e.target.files[0])
  const headers = { 'Content-Type': 'multipart/form-data' }
  axios.post(`${apiHost}/file`, formData, { headers })
    .then((response) => {
      emit('file-uploaded', response.data.fileUrl)
    })
    .catch((error) => {
      console.error(error)
    })
}
</script>

<style scoped>
.file-select > input[type="file"] {
  display: none;
}

.button {
  display: inline-block;
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
</style>

<template>
  <label class="file-select">
    <span class="button">
      Select File
    </span>
    <input type="file" @change="handleFileChange"/>
  </label>
</template>
