<script setup lang="ts">
import { computed } from 'vue'
import { store, goto, resetProject, deleteProject, addProject } from '@/store'
import { CRITERIA } from '@/data/criteria'
import CriterionBlock from '@/components/CriterionBlock.vue'

// `current` is always clamped to a valid index, so the project exists.
const project = computed(() => store.projects[store.current]!)
const total = computed(() => store.projects.length)
const totalLabel = computed(() => String(total.value).padStart(2, '0'))
const projNum = computed(() => String(store.current + 1).padStart(2, '0'))
const atStart = computed(() => store.current === 0)
const atEnd = computed(() => store.current === total.value - 1)
</script>

<template>
  <section id="view-score" class="view" role="tabpanel" aria-label="Score">
    <div class="scorecard">
      <div class="proj-nav">
        <button
          class="nav-btn"
          aria-label="Previous project"
          :disabled="atStart"
          @click="goto(store.current - 1)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12.5 4L6.5 10L12.5 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <div class="proj-id">
          <span class="proj-eyebrow">Project</span>
          <span class="proj-num">{{ projNum }}<span class="proj-of">/ {{ totalLabel }}</span></span>
        </div>
        <button
          v-if="atEnd"
          class="nav-btn add-btn"
          aria-label="Add project"
          @click="addProject"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 4.5V15.5M4.5 10H15.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <button
          v-else
          class="nav-btn"
          aria-label="Next project"
          @click="goto(store.current + 1)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M7.5 4L13.5 10L7.5 16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>

      <input
        class="proj-name"
        type="text"
        placeholder="Team or project name"
        autocomplete="off"
        v-model="project.name"
      />

      <CriterionBlock
        v-for="crit in CRITERIA"
        :key="crit.id"
        :crit="crit"
        :model-value="project.scores[crit.id] ?? null"
        @update:model-value="project.scores[crit.id] = $event"
      />

      <label class="notes">
        <span class="notes-label">Notes</span>
        <textarea rows="3" placeholder="Likes, dislikes, first impression…" v-model="project.notes"></textarea>
      </label>

      <div class="card-actions">
        <button class="reset-btn" @click="resetProject(store.current)">Reset project</button>
        <button class="reset-btn danger" @click="deleteProject(store.current)">Delete project</button>
      </div>
    </div>

    <p class="rubric-note">
      The rubric is a tool to inform your decision. You don’t have to give the
      prize to the team with the most points.
    </p>
  </section>
</template>
