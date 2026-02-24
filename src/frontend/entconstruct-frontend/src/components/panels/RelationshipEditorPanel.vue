<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import type { RelationshipType, EntityRelationshipData } from '@/types/relationship'
import { useRelationshipEditorStore } from '@/stores'

const store = useRelationshipEditorStore()
const { findEdge, findNode } = useVueFlow('main-canvas')

const localData = ref<EntityRelationshipData>({ type: 'one-to-many' })

const currentEdge = computed(() =>
  store.selectedEdgeId ? findEdge(store.selectedEdgeId) : null,
)

const sourceName = computed(() => {
  const nodeId = currentEdge.value?.source
  return nodeId ? (findNode(nodeId)?.data?.name || 'Unnamed') : ''
})

const targetName = computed(() => {
  const nodeId = currentEdge.value?.target
  return nodeId ? (findNode(nodeId)?.data?.name || 'Unnamed') : ''
})

const defaultJunctionName = computed(() => `${sourceName.value}${targetName.value}`)

watch(
  () => store.selectedEdgeId,
  (edgeId) => {
    if (!edgeId) return
    const edge = findEdge(edgeId)
    if (edge?.data) {
      localData.value = { ...edge.data } as EntityRelationshipData
    } else {
      localData.value = { type: 'one-to-many' }
    }
  },
)

// When switching to many-to-many, auto-fill junction name if empty
watch(
  () => localData.value.type,
  (type) => {
    if (type === 'many-to-many' && !localData.value.junctionTableName) {
      localData.value.junctionTableName = defaultJunctionName.value
    }
  },
)

// The entity that sits on the "1" side, and the one on the "N" side — updates when flipped
const oneSideName = computed(() =>
  localData.value.reversed ? targetName.value : sourceName.value,
)
const nSideName = computed(() =>
  localData.value.reversed ? sourceName.value : targetName.value,
)
// Default nav property name: camelCase of the 1-side entity (e.g. "User" → "user")
const defaultNavPropertyName = computed(() => {
  const name = oneSideName.value
  return name ? name.charAt(0).toLowerCase() + name.slice(1) : ''
})

const sourceCardinality = computed(() => {
  if (localData.value.type === 'one-to-one') return '1'
  if (localData.value.type === 'many-to-many') return 'N'
  return localData.value.reversed ? 'N' : '1'
})

const targetCardinality = computed(() => {
  if (localData.value.type === 'one-to-one') return '1'
  if (localData.value.type === 'many-to-many') return 'N'
  return localData.value.reversed ? '1' : 'N'
})

function flipDirection() {
  localData.value.reversed = !localData.value.reversed
}

const relationshipOptions: { value: RelationshipType; label: string }[] = [
  { value: 'one-to-one', label: '1 : 1' },
  { value: 'one-to-many', label: '1 : N' },
  { value: 'many-to-many', label: 'N : N' },
]

function save() {
  const edge = currentEdge.value
  if (!edge) return
  edge.data = { ...localData.value }
  store.closeRelationshipPanel()
}

function cancel() {
  store.closeRelationshipPanel()
}
</script>

<template>
  <Transition name="panel">
    <div v-if="store.isRelationshipPanelOpen" class="rel-panel">
      <div class="rel-panel__header">
        <h2 class="rel-panel__title">Edit Relationship</h2>
        <button class="rel-panel__close" title="Close" @click="cancel">✕</button>
      </div>

      <div class="rel-panel__body">
        <!-- Entity direction indicator with cardinality -->
        <div class="rel-panel__entities">
          <span class="rel-panel__cardinality">{{ sourceCardinality }}</span>
          <span class="rel-panel__entity-name">{{ sourceName }}</span>
          <span class="rel-panel__arrow">→</span>
          <span class="rel-panel__entity-name">{{ targetName }}</span>
          <span class="rel-panel__cardinality">{{ targetCardinality }}</span>
          <button
            v-if="localData.type === 'one-to-many'"
            class="rel-panel__flip-btn"
            title="Flip direction"
            @click="flipDirection"
          >⇄</button>
        </div>

        <!-- Relationship type selector -->
        <div class="rel-panel__field">
          <label class="rel-panel__label">Relationship type</label>
          <div class="rel-panel__type-group">
            <button
              v-for="opt in relationshipOptions"
              :key="opt.value"
              class="rel-panel__type-btn"
              :class="{ 'rel-panel__type-btn--active': localData.type === opt.value }"
              @click="localData.type = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <!-- Navigation property (one-to-many only) -->
        <div v-if="localData.type === 'one-to-many'" class="rel-panel__field">
          <label class="rel-panel__label">Navigation property on {{ nSideName }}</label>
          <input
            v-model="localData.navigationPropertyName"
            class="rel-panel__input"
            :placeholder="defaultNavPropertyName"
          />
        </div>

        <!-- Junction table (many-to-many only) -->
        <div v-if="localData.type === 'many-to-many'" class="rel-panel__field">
          <label class="rel-panel__label">Junction table</label>
          <input
            v-model="localData.junctionTableName"
            class="rel-panel__input"
            :placeholder="defaultJunctionName"
          />
        </div>
      </div>

      <div class="rel-panel__footer">
        <button class="rel-panel__btn rel-panel__btn--cancel" @click="cancel">Cancel</button>
        <button class="rel-panel__btn rel-panel__btn--save" @click="save">Save</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.rel-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 340px;
  background: #fff;
  border-left: 1px solid #e2e8f0;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.rel-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.rel-panel__title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.rel-panel__close {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.15s;
}

.rel-panel__close:hover {
  color: #1e293b;
}

.rel-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Source → Target indicator */
.rel-panel__entities {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.rel-panel__entity-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  flex: 1;
  text-align: center;
}

.rel-panel__arrow {
  color: #94a3b8;
  font-size: 18px;
  flex-shrink: 0;
}

.rel-panel__cardinality {
  font-size: 12px;
  font-weight: 700;
  color: #6366f1;
  background: #eef2ff;
  border-radius: 4px;
  padding: 2px 6px;
  flex-shrink: 0;
  min-width: 20px;
  text-align: center;
}

.rel-panel__flip-btn {
  background: none;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 3px 7px;
  font-size: 14px;
  color: #64748b;
  cursor: pointer;
  flex-shrink: 0;
  transition: border-color 0.15s, color 0.15s;
}

.rel-panel__flip-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.rel-panel__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rel-panel__label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Type buttons */
.rel-panel__type-group {
  display: flex;
  gap: 8px;
}

.rel-panel__type-btn {
  flex: 1;
  padding: 9px 0;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  background: none;
  color: #475569;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.rel-panel__type-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.rel-panel__type-btn--active {
  border-color: #6366f1;
  background: #6366f1;
  color: #fff;
}

.rel-panel__type-btn--active:hover {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #fff;
}

.rel-panel__input {
  padding: 7px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  font-size: 13px;
  color: #1e293b;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.15s;
}

.rel-panel__input:focus {
  border-color: #6366f1;
}

.rel-panel__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
}

.rel-panel__btn {
  padding: 8px 18px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, color 0.15s;
}

.rel-panel__btn--cancel {
  background: none;
  border-color: #cbd5e1;
  color: #475569;
}

.rel-panel__btn--cancel:hover {
  background: #f8fafc;
}

.rel-panel__btn--save {
  background: #6366f1;
  color: #fff;
}

.rel-panel__btn--save:hover {
  background: #4f46e5;
}

.panel-enter-active,
.panel-leave-active {
  transition: transform 0.25s ease;
}

.panel-enter-from,
.panel-leave-to {
  transform: translateX(100%);
}
</style>
