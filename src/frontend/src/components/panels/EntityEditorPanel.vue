<script setup lang="ts">
import { ref, watch } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import type { EntityNodeData } from '@/types/entity'
import { useEntityEditorStore } from '@/stores'

const store = useEntityEditorStore()
const { findNode, updateNodeData } = useVueFlow('main-canvas')

const localData = ref<EntityNodeData>({ name: '', properties: [] })

watch(
  () => store.selectedNodeId,
  (nodeId) => {
    if (!nodeId) return
    const node = findNode(nodeId)
    if (node) {
      localData.value = JSON.parse(JSON.stringify(node.data)) as EntityNodeData
    }
  },
)

function addProperty() {
  localData.value.properties.push({
    id: crypto.randomUUID(),
    name: '',
    type: '',
    description: '',
  })
}

function removeProperty(id: string) {
  localData.value.properties = localData.value.properties.filter((p) => p.id !== id)
}

function save() {
  if (!store.selectedNodeId) return
  updateNodeData(store.selectedNodeId, { ...localData.value })
  store.closePanel()
}

function cancel() {
  store.closePanel()
}
</script>

<template>
  <Transition name="panel">
    <div v-if="store.isPanelOpen" class="editor-panel">
      <div class="editor-panel__header">
        <h2 class="editor-panel__title">Edit Entity</h2>
        <button class="editor-panel__close" title="Close" @click="cancel">✕</button>
      </div>

      <div class="editor-panel__body">
        <div class="editor-panel__field">
          <label class="editor-panel__label">Entity name</label>
          <input v-model="localData.name" class="editor-panel__input" placeholder="e.g. User" />
        </div>

        <div class="editor-panel__section">
          <div class="editor-panel__section-header">
            <span class="editor-panel__section-title">Properties</span>
            <button class="editor-panel__add-btn" @click="addProperty">+ Add</button>
          </div>

          <div v-if="!localData.properties.length" class="editor-panel__empty">
            No properties yet.
          </div>

          <div
            v-for="prop in localData.properties"
            :key="prop.id"
            class="editor-panel__prop-card"
          >
            <div class="editor-panel__prop-row">
              <input
                v-model="prop.name"
                class="editor-panel__input"
                placeholder="Name"
              />
              <input
                v-model="prop.type"
                class="editor-panel__input editor-panel__input--type"
                placeholder="Type"
              />
              <button
                class="editor-panel__remove-btn"
                title="Remove property"
                @click="removeProperty(prop.id)"
              >
                ✕
              </button>
            </div>
            <input
              v-model="prop.description"
              class="editor-panel__input editor-panel__input--desc"
              placeholder="Description (optional)"
            />
          </div>
        </div>
      </div>

      <div class="editor-panel__footer">
        <button class="editor-panel__btn editor-panel__btn--cancel" @click="cancel">Cancel</button>
        <button class="editor-panel__btn editor-panel__btn--save" @click="save">Save</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.editor-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 380px;
  background: #fff;
  border-left: 1px solid #e2e8f0;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.editor-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.editor-panel__title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.editor-panel__close {
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  font-size: 16px;
  padding: 4px;
  border-radius: 4px;
  transition: color 0.15s;
}

.editor-panel__close:hover {
  color: #1e293b;
}

.editor-panel__body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.editor-panel__field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.editor-panel__label,
.editor-panel__section-title {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.editor-panel__input {
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

.editor-panel__input:focus {
  border-color: #6366f1;
}

.editor-panel__section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.editor-panel__section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.editor-panel__add-btn {
  background: none;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 3px 10px;
  font-size: 12px;
  color: #475569;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
}

.editor-panel__add-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.editor-panel__empty {
  font-size: 13px;
  color: #94a3b8;
  font-style: italic;
}

.editor-panel__prop-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #f8fafc;
}

.editor-panel__prop-row {
  display: flex;
  gap: 6px;
  align-items: center;
}

.editor-panel__input--type {
  flex: 0 0 100px;
  width: 100px;
}

.editor-panel__input--desc {
  font-size: 12px;
  color: #64748b;
}

.editor-panel__remove-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 14px;
  padding: 4px 6px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 0.15s;
}

.editor-panel__remove-btn:hover {
  color: #ef4444;
}

.editor-panel__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 20px;
  border-top: 1px solid #e2e8f0;
}

.editor-panel__btn {
  padding: 8px 18px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: background 0.15s, color 0.15s;
}

.editor-panel__btn--cancel {
  background: none;
  border-color: #cbd5e1;
  color: #475569;
}

.editor-panel__btn--cancel:hover {
  background: #f8fafc;
}

.editor-panel__btn--save {
  background: #6366f1;
  color: #fff;
}

.editor-panel__btn--save:hover {
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
