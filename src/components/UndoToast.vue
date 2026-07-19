<script setup lang="ts">
import { watch, onUnmounted } from 'vue'
import { store, undoReset, dismissUndo } from '@/store'

// Auto-dismiss the toast after a short window, like Gmail's undo prompt.
const AUTO_DISMISS_MS = 6000
let timer: ReturnType<typeof setTimeout> | undefined

function clear(): void {
  if (timer !== undefined) {
    clearTimeout(timer)
    timer = undefined
  }
}

// Restart the countdown each time a new undo appears; stop it when cleared.
watch(
  () => store.undo,
  (undo) => {
    clear()
    if (undo) timer = setTimeout(dismissUndo, AUTO_DISMISS_MS)
  },
)

onUnmounted(clear)
</script>

<template>
  <transition name="toast">
    <div
      v-if="store.undo"
      class="undo-toast"
      :class="{ 'above-bar': store.view === 'score' }"
      role="status"
      aria-live="polite"
    >
      <span class="undo-msg">{{ store.undo.label }}.</span>
      <button class="undo-btn" @click="undoReset">Undo</button>
      <button class="undo-x" aria-label="Dismiss" @click="dismissUndo">×</button>
    </div>
  </transition>
</template>
