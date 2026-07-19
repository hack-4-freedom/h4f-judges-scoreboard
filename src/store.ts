import { reactive, watch } from 'vue'
import { CRITERIA, type Project, type Score } from '@/data/criteria'

const STORAGE_KEY = 'h4f-judging:v1'

type View = 'score' | 'board'

/** A copy of all project data taken just before a destructive action, so it can be undone. */
interface Snapshot {
  label: string
  projects: Project[]
  /** The selected project index at snapshot time, restored on undo. */
  current: number
}

interface Store {
  projects: Project[]
  current: number
  view: View
  /** The most recent reset, available to undo. Null when nothing is pending. */
  undo: Snapshot | null
}

/* ---------- factories ---------- */

function emptyScores(): Record<string, Score> {
  return Object.fromEntries(CRITERIA.map((c) => [c.id, null])) as Record<string, Score>
}

function makeProject(): Project {
  return { name: '', notes: '', scores: emptyScores() }
}

function makeProjects(): Project[] {
  return [makeProject()]
}

function cloneProjects(projects: Project[]): Project[] {
  return projects.map((p) => ({ name: p.name, notes: p.notes, scores: { ...p.scores } }))
}

/* ---------- persistence ---------- */

interface Persisted {
  projects?: unknown
  current?: unknown
}

// Rebuild a project from unknown stored data, keeping only fields and score keys
// that match the current rubric. Unknown keys are dropped, missing ones default
// to null — so a stored state stays loadable even if the criteria set changed.
function normalizeProject(raw: unknown): Project {
  const project = makeProject()
  if (raw && typeof raw === 'object') {
    const r = raw as Record<string, unknown>
    if (typeof r.name === 'string') project.name = r.name
    if (typeof r.notes === 'string') project.notes = r.notes
    if (r.scores && typeof r.scores === 'object') {
      const scores = r.scores as Record<string, unknown>
      for (const c of CRITERIA) {
        const v = scores[c.id]
        if (typeof v === 'number') project.scores[c.id] = v
      }
    }
  }
  return project
}

function loadState(): { projects: Project[]; current: number } {
  const fallback = { projects: makeProjects(), current: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fallback
    const data = JSON.parse(raw) as Persisted
    const projects =
      Array.isArray(data.projects) && data.projects.length > 0
        ? data.projects.map(normalizeProject)
        : makeProjects()
    const current =
      typeof data.current === 'number'
        ? Math.max(0, Math.min(projects.length - 1, data.current))
        : 0
    return { projects, current }
  } catch {
    return fallback
  }
}

function save(): void {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ projects: store.projects, current: store.current }),
    )
  } catch {
    // storage unavailable or full; edits simply won't persist
  }
}

/* ---------- store ---------- */

const initial = loadState()

export const store = reactive<Store>({
  projects: initial.projects,
  current: initial.current,
  view: 'score',
  undo: null,
})

// Persist on any change to project data or the current index.
watch([() => store.projects, () => store.current], save, { deep: true })

/* ---------- navigation ---------- */

export function goto(index: number): void {
  store.current = Math.max(0, Math.min(store.projects.length - 1, index))
}

/** Append a fresh project and open it. */
export function addProject(): void {
  store.projects.push(makeProject())
  store.current = store.projects.length - 1
  store.view = 'score'
  window.scrollTo({ top: 0 })
}

export function setView(view: View): void {
  store.view = view
}

export function openProject(index: number): void {
  goto(index)
  store.view = 'score'
  window.scrollTo({ top: 0 })
}

/* ---------- reset + undo ---------- */

function projectLabel(index: number): string {
  const project = store.projects[index]
  const num = String(index + 1).padStart(2, '0')
  return project && project.name ? project.name : `project ${num}`
}

function snapshot(label: string): Snapshot {
  return { label, projects: cloneProjects(store.projects), current: store.current }
}

export function resetProject(index: number): void {
  store.undo = snapshot(`Reset ${projectLabel(index)}`)
  store.projects[index] = makeProject()
}

/** Remove a project. If it was the last one, leave a single fresh project behind. */
export function deleteProject(index: number): void {
  store.undo = snapshot(`Deleted ${projectLabel(index)}`)
  store.projects.splice(index, 1)
  if (store.projects.length === 0) store.projects.push(makeProject())
  store.current = Math.max(0, Math.min(store.projects.length - 1, index))
}

export function resetAll(): void {
  store.undo = snapshot('Reset all projects')
  store.projects = makeProjects()
  store.current = 0
}

export function undoReset(): void {
  if (!store.undo) return
  store.projects = store.undo.projects
  store.current = Math.max(0, Math.min(store.projects.length - 1, store.undo.current))
  store.undo = null
}

export function dismissUndo(): void {
  store.undo = null
}
