<script setup lang="ts">
import { ref } from 'vue'
import { useVueFlow } from '@vue-flow/core'
import type { Node } from '@vue-flow/core'
import type { EntityNodeData } from '@/types/entity'
import { useEntityEditorStore } from '@/stores'

const isOpen = ref(true)
const store = useEntityEditorStore()
const { addNodes, getNodes } = useVueFlow('main-canvas')

function addEntity() {
  const id = crypto.randomUUID()
  const offset = getNodes.value.length * 40
  const newNode: Node<EntityNodeData> = {
    id,
    type: 'entityNode',
    position: { x: 100 + offset, y: 100 + offset },
    data: { name: '', properties: [] },
  }
  addNodes([newNode])
  store.openPanel(id)
}
</script>

<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': !isOpen }">
    <div class="sidebar__header">
      <button
        class="sidebar__toggle"
        :title="isOpen ? 'Collapse sidebar' : 'Expand sidebar'"
        @click="isOpen = !isOpen"
      >
        {{ isOpen ? '‹' : '›' }}
      </button>
    </div>

    <div class="sidebar__nav">
      <button class="sidebar__item" title="Add entity" @click="addEntity">
        <span class="sidebar__item-icon">
          <span class="sidebar__item-icon-badge">+</span>
        </span>
        <span class="sidebar__item-label">Add Entity</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.2s ease;
}

.sidebar--collapsed {
  width: 50px;
}

/* Header always renders at full sidebar width, toggle sits on the right */
.sidebar__header {
  height: 41px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 13px;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.sidebar--collapsed .sidebar__header {
  justify-content: center;
  padding: 0;
}

.sidebar__toggle {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  cursor: pointer;
  color: #64748b;
  font-size: 18px;
  line-height: 1;
  transition: border-color 0.15s, color 0.15s;
}

.sidebar__toggle:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.sidebar__nav {
  padding: 8px 0;
  display: flex;
  flex-direction: column;
}

.sidebar__item {
  display: flex;
  align-items: center;
  height: 40px;
  width: 100%;
  padding: 0;
  background: none;
  border: none;
  cursor: pointer;
  color: #334155;
  white-space: nowrap;
  text-align: left;
  transition: background 0.15s;
}

.sidebar__item:hover {
  background: #e2e8f0;
}

/*
  Icon zone is always exactly 50px wide.
  This matches the collapsed sidebar width, so the icon
  is naturally centered with no padding calculation needed.
*/
.sidebar__item-icon {
  width: 50px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar__item-icon-badge {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6366f1;
  color: #fff;
  border-radius: 5px;
  font-size: 20px;
  font-weight: 300;
  line-height: 1;
}

.sidebar__item-label {
  font-size: 13px;
  font-weight: 500;
  transition: opacity 0.15s;
}

.sidebar--collapsed .sidebar__item-label {
  opacity: 0;
}
</style>
