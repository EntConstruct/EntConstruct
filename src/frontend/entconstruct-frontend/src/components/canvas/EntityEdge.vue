<script setup lang="ts">
import { computed, ref } from 'vue'
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@vue-flow/core'
import type { EdgeProps } from '@vue-flow/core'
import type { EntityRelationshipData } from '@/types/relationship'
import { useRelationshipEditorStore } from '@/stores'

const props = defineProps<EdgeProps<EntityRelationshipData>>()

const store = useRelationshipEditorStore()
const isHovered = ref(false)

const pathData = computed(() =>
  getBezierPath({
    sourceX: props.sourceX,
    sourceY: props.sourceY,
    sourcePosition: props.sourcePosition,
    targetX: props.targetX,
    targetY: props.targetY,
    targetPosition: props.targetPosition,
  }),
)

const path = computed(() => pathData.value[0])
const labelX = computed(() => pathData.value[1])
const labelY = computed(() => pathData.value[2])

const relationshipLabel = computed(() => {
  switch (props.data?.type) {
    case 'one-to-one': return '1 : 1'
    case 'one-to-many': return props.data.reversed ? 'N : 1' : '1 : N'
    case 'many-to-many': return 'N : N'
    default: return '1 : N'
  }
})
</script>

<template>
  <BaseEdge :id="props.id" :path="path" :marker-end="props.markerEnd" />

  <EdgeLabelRenderer>
    <div
      class="nodrag nopan edge-label"
      :style="{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
        pointerEvents: 'all',
      }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <span class="edge-label__type">{{ relationshipLabel }}</span>
      <span
        v-if="props.data?.type === 'many-to-many' && props.data.junctionTableName"
        class="edge-label__junction"
      >
        {{ props.data.junctionTableName }}
      </span>
      <button
        v-show="isHovered"
        class="edge-label__edit-btn"
        title="Edit relationship"
        @click="store.openRelationshipPanel(props.id)"
      >
        ✎
      </button>
    </div>
  </EdgeLabelRenderer>
</template>

<style scoped>
.edge-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 12px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  min-width: 44px;
  text-align: center;
}

.edge-label__type {
  font-weight: 600;
  color: #334155;
  line-height: 1.2;
}

.edge-label__junction {
  color: #64748b;
  font-size: 11px;
  font-style: italic;
  line-height: 1.2;
}

.edge-label__edit-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  font-size: 13px;
  padding: 0 2px;
  line-height: 1;
  transition: color 0.15s;
}

.edge-label__edit-btn:hover {
  color: #6366f1;
}
</style>
