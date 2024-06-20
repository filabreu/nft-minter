<script setup lang="ts">
import { defineProps } from 'vue'

defineProps({
  disabled: Boolean
})
</script>

<style scoped>
.button {
  padding: 0.75rem 2rem;
  line-height: 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  font-family: inherit;
  color: black;
  background-color: mediumturquoise;
  border-radius: 2rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>

<template>
  <button class="button" :disabled="disabled">
    <slot>Click</slot>
  </button>
</template>
