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
.file-select > .select-button {
  padding: 1rem;

  color: white;
  background-color: #2EA169;

  border-radius: .3rem;

  text-align: center;
  font-weight: bold;
}

.file-select > input[type="file"] {
  display: none;
}
</style>

<template>
  <label class="file-select">
    <div class="select-button">
      <span>Select File</span>
    </div>
    <input type="file" @change="handleFileChange"/>
  </label>
</template>
