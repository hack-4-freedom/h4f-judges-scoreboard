<script setup lang="ts">
import { computed } from 'vue'
import { store } from '@/store'
import { CRITERIA, MAX_TOTAL, scoreTotal, formatScore } from '@/data/criteria'

const project = computed(() => store.projects[store.current]!)
const scores = computed(() => CRITERIA.map((c) => project.value.scores[c.id]))
const anyScored = computed(() => scores.value.some((s) => s != null))
const done = computed(() => scores.value.every((s) => s != null))
const total = computed(() => formatScore(scoreTotal(project.value)))
const tbNum = computed(() => String(store.current + 1).padStart(2, '0'))
</script>

<template>
  <div class="totalbar">
    <div class="totalbar-inner">
      <div class="tb-proj" aria-label="Current project">
        <span class="tb-num">{{ tbNum }}</span>
        <span class="tb-name" :class="{ 'is-unnamed': !project.name }">
          {{ project.name || 'Unnamed' }}
        </span>
      </div>
      <div class="total-paddle" :class="{ 'is-raised': done }" aria-live="polite">
        <span class="tp-label">Total</span>
        <span class="tp-num">{{ anyScored ? total : '–' }}</span>
        <span class="tp-max">/ {{ MAX_TOTAL }}</span>
        <span class="tp-hole" aria-hidden="true"></span>
      </div>
    </div>
  </div>
</template>
