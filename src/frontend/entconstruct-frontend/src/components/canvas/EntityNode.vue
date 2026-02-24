<script setup lang="ts">
import { ref } from 'vue'
import { Handle, Position } from '@vue-flow/core'
import type { NodeProps } from '@vue-flow/core'
import type { EntityNodeData } from '@/types/entity'
import { useEntityEditorStore } from '@/stores'

const props = defineProps<NodeProps<EntityNodeData>>()

const store = useEntityEditorStore()
const isHovered = ref(false)
</script>

<template>
  <div
    class="entity-node"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <Handle type="target" :position="Position.Top" />

    <div class="entity-node__header">
      <span class="entity-node__name">{{ props.data.name || 'Unnamed Entity' }}</span>
      <button
        v-show="isHovered"
        class="entity-node__edit-btn"
        title="Edit entity"
        @mousedown.stop
        @click.stop="store.openPanel(props.id)"
      >
        ✎
      </button>
    </div>

    <div class="entity-node__body">
      <div
        v-for="prop in props.data.properties"
        :key="prop.id"
        class="entity-node__row"
      >
        <span class="entity-node__prop-name">{{ prop.name }}</span>
        <span class="entity-node__prop-type">{{ prop.type }}</span>
      </div>
      <div v-if="!props.data.properties.length" class="entity-node__empty">
        No properties
      </div>
    </div>

    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<style scoped>
.entity-node {
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  min-width: 200px;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.entity-node__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  background: #1e293b;
  color: #fff;
  border-radius: 5px 5px 0 0;
  gap: 8px;
  min-height: 36px;
}

.entity-node__name {
  font-weight: 600;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.entity-node__edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 14px;
  line-height: 1;
  flex-shrink: 0;
  transition: color 0.15s, background 0.15s;
}

.entity-node__edit-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.entity-node__body {
  padding: 4px 0;
}

.entity-node__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 10px;
  border-bottom: 1px solid #f1f5f9;
  gap: 16px;
}

.entity-node__row:last-child {
  border-bottom: none;
}

.entity-node__prop-name {
  color: #334155;
  flex: 1;
}

.entity-node__prop-type {
  color: #64748b;
  font-size: 11px;
  font-style: italic;
  flex-shrink: 0;
}

.entity-node__empty {
  padding: 8px 10px;
  color: #94a3b8;
  font-style: italic;
  font-size: 12px;
}
</style>
