<script setup lang="ts">
import { computed } from 'vue'
import { store, setView } from '@/store'
import ScoreView from '@/components/ScoreView.vue'
import BoardView from '@/components/BoardView.vue'
import TotalBar from '@/components/TotalBar.vue'
import UndoToast from '@/components/UndoToast.vue'

const isScore = computed(() => store.view === 'score')
</script>

<template>
  <div class="app-root" :class="{ 'is-board': !isScore }">
    <header class="top">
      <div class="brand">
        <img class="brand-logo" src="/logo.png" alt="Hack4Freedom" />
        <span class="brand-sub">Judge’s scorecard</span>
      </div>
      <nav class="tabs" role="tablist" aria-label="Views">
        <button
          class="tab"
          :class="{ 'is-active': isScore }"
          role="tab"
          :aria-selected="isScore"
          @click="setView('score')"
        >
          Score
        </button>
        <button
          class="tab"
          :class="{ 'is-active': !isScore }"
          role="tab"
          :aria-selected="!isScore"
          @click="setView('board')"
        >
          Board
        </button>
      </nav>
    </header>

    <main class="wrap">
      <ScoreView v-show="isScore" />
      <BoardView v-show="!isScore" />
    </main>

    <TotalBar v-show="isScore" />
    <UndoToast />
  </div>
</template>
