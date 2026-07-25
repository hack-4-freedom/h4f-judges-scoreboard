<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import QRCode from 'qrcode'
import { store, openProject, resetAll } from '@/store'
import { CRITERIA, scoreTotal, formatScore, type Project } from '@/data/criteria'

interface Row {
  i: number
  project: Project
  total: number | null
}

const rows = computed<Row[]>(() =>
  store.projects.map((project, i) => {
    const complete = CRITERIA.every((c) => project.scores[c.id] != null)
    const total = complete ? formatScore(scoreTotal(project)) : null
    return { i, project, total }
  }),
)

const best = computed(() => Math.max(0, ...rows.value.map((r) => r.total ?? 0)))
const scoredCount = computed(() => rows.value.filter((r) => r.total != null).length)

const sortByScore = ref(false)

const displayRows = computed<Row[]>(() => {
  if (!sortByScore.value) return rows.value
  return [...rows.value].sort((a, b) => (b.total ?? -1) - (a.total ?? -1))
})

const legend = computed(() =>
  CRITERIA.map((c) => `${c.key}: ${c.title.toLowerCase()}`).join(' · '),
)

function isLeader(row: Row): boolean {
  return row.total != null && row.total === best.value && best.value > 0
}

/* ---------- CSV export + QR ---------- */

function csvField(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
}

const includeNotes = ref(false)

const csv = computed<string>(() => {
  const header = ['#', 'Project', ...CRITERIA.map((c) => c.key), 'Total']
  if (includeNotes.value) header.push('Notes')
  const lines = [header.join(',')]
  for (const row of rows.value) {
    const fields = [
      String(row.i + 1),
      row.project.name,
      ...CRITERIA.map((c) => (row.project.scores[c.id] != null ? String(row.project.scores[c.id]) : '')),
      row.total != null ? String(row.total) : '',
    ]
    if (includeNotes.value) fields.push(row.project.notes)
    lines.push(fields.map(csvField).join(','))
  }
  return lines.join('\n')
})

const qrDataUrl = ref<string | null>(null)
const qrError = ref<string | null>(null)

watch(
  csv,
  async (value) => {
    try {
      qrDataUrl.value = await QRCode.toDataURL(value, {
        errorCorrectionLevel: 'L',
        margin: 1,
        width: 320,
      })
      qrError.value = null
    } catch {
      qrDataUrl.value = null
      qrError.value = 'Too much data for one QR code. Download the CSV instead.'
    }
  },
  { immediate: true },
)

function downloadCsv(): void {
  const blob = new Blob([csv.value], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'board.csv'
  a.click()
  URL.revokeObjectURL(url)
}

const copied = ref(false)
let copiedTimer: ReturnType<typeof setTimeout> | undefined

async function copyCsv(): Promise<void> {
  await navigator.clipboard.writeText(csv.value)
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <section id="view-board" class="view" role="tabpanel" aria-label="Board">
    <div class="board-head">
      <h2 class="board-title">All projects</h2>
      <div class="board-head-right">
        <span class="board-progress">{{ scoredCount }} of {{ store.projects.length }} scored</span>
        <label class="notes-toggle">
          <input type="checkbox" v-model="sortByScore" />
          <span class="notes-toggle-track"><span class="notes-toggle-thumb" /></span>
          Sort by score
        </label>
        <button class="reset-btn" @click="resetAll">Reset all</button>
      </div>
    </div>

    <div class="board-scroll">
      <table class="board">
        <thead>
          <tr>
            <th class="col-num">#</th>
            <th class="col-name">Project</th>
            <th v-for="crit in CRITERIA" :key="crit.id" class="col-score">{{ crit.key }}</th>
            <th class="col-total">Total</th>
            <th class="col-notes">Notes</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in displayRows"
            :key="row.i"
            :class="{ 'is-leader': isLeader(row) }"
            @click="openProject(row.i)"
          >
            <td class="cell-num">{{ String(row.i + 1).padStart(2, '0') }}</td>
            <td class="cell-name">
              <template v-if="row.project.name">{{ row.project.name }}</template>
              <span v-else class="unnamed">Unnamed</span>
              <span v-if="isLeader(row)" class="lead-tag">Leads</span>
            </td>
            <td v-for="crit in CRITERIA" :key="crit.id" class="cell-score">
              <span v-if="row.project.scores[crit.id] != null">{{ row.project.scores[crit.id] }}</span>
              <span v-else class="empty">–</span>
            </td>
            <td class="cell-total">
              <template v-if="row.total != null">{{ row.total }}</template>
              <span v-else class="empty">–</span>
            </td>
            <td class="cell-notes">{{ row.project.notes }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="board-hint">{{ legend }}. Tap a row to open its scorecard.</p>

    <div class="board-qr">
      <template v-if="qrDataUrl">
        <button class="qr-button" @click="copyCsv" title="Copy CSV to clipboard">
          <img :src="qrDataUrl" alt="QR code of the board as CSV" class="qr-image" />
        </button>
        <p class="qr-caption">{{ copied ? 'Copied to clipboard' : 'Scan or click for CSV' }}</p>
      </template>
      <template v-else-if="qrError">
        <p class="qr-caption">{{ qrError }}</p>
        <button class="qr-download" @click="downloadCsv">Download CSV</button>
      </template>
      <label class="notes-toggle">
        <input type="checkbox" v-model="includeNotes" />
        <span class="notes-toggle-track"><span class="notes-toggle-thumb" /></span>
        Include notes
      </label>
    </div>
  </section>
</template>
