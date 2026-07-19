<script setup lang="ts">
import { ref, computed } from 'vue'
import { HINT_DEFAULT, type Criterion, type Score } from '@/data/criteria'

const props = defineProps<{
  crit: Criterion
  modelValue: Score
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Score]
}>()

// On desktop, hovering a paddle previews that level's description without
// committing it. The committed score is shown when nothing is hovered.
const hovered = ref<number | null>(null)

const active = computed<number | null>(() => hovered.value ?? props.modelValue)
const isLive = computed(() => active.value != null)
const weightPct = computed(() => Math.round(props.crit.weight * 100))
const hintText = computed(() =>
  active.value ? `${active.value}: ${props.crit.levels[active.value - 1] ?? ''}` : HINT_DEFAULT,
)

function pick(value: number): void {
  // tapping the selected paddle again clears the score
  emit('update:modelValue', props.modelValue === value ? null : value)
}
</script>

<template>
  <section class="crit">
    <header class="crit-head">
      <span class="crit-key">{{ crit.key }}</span>
      <div class="crit-headings">
        <h2 class="crit-title">{{ crit.title }}</h2>
        <p class="crit-sub">{{ crit.sub }}</p>
      </div>
      <span class="crit-weight" :title="`Worth ${weightPct}% of the total`">{{ weightPct }}%</span>
    </header>

    <div class="paddles" role="radiogroup" :aria-label="`${crit.title} score, 1 to 5`">
      <button
        v-for="v in 5"
        :key="v"
        class="paddle"
        role="radio"
        :aria-checked="modelValue === v"
        :aria-label="`${crit.title}, ${v}: ${crit.levels[v - 1]}`"
        @click="pick(v)"
        @mouseenter="hovered = v"
        @mouseleave="hovered = null"
      >
        <span class="paddle-num">{{ v }}</span>
      </button>
    </div>

    <p class="crit-hint" :class="{ 'is-live': isLive }">{{ hintText }}</p>
  </section>
</template>
