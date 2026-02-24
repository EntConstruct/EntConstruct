<script setup lang="ts">
import { VueFlow, ConnectionMode } from '@vue-flow/core'
import type { Node } from '@vue-flow/core'
import { useVueFlow } from '@vue-flow/core'
import type { EntityNodeData } from '@/types/entity'
import type { EntityRelationshipData } from '@/types/relationship'
import EntityNode from '@/components/canvas/EntityNode.vue'
import EntityEdge from '@/components/canvas/EntityEdge.vue'
import EntityEditorPanel from '@/components/panels/EntityEditorPanel.vue'
import RelationshipEditorPanel from '@/components/panels/RelationshipEditorPanel.vue'
import AppSidebar from '@/components/AppSidebar.vue'

const nodeTypes = { entityNode: EntityNode }
const edgeTypes = { entityEdge: EntityEdge }

const { onConnect, addEdges } = useVueFlow('main-canvas')

onConnect((connection) => {
  addEdges([{
    ...connection,
    id: crypto.randomUUID(),
    type: 'entityEdge',
    data: { type: 'one-to-many' } satisfies EntityRelationshipData,
  }])
})

const initialNodes: Node<EntityNodeData>[] = [
  {
    id: '1',
    type: 'entityNode',
    position: { x: 100, y: 100 },
    data: {
      name: 'User',
      properties: [
        { id: crypto.randomUUID(), name: 'id', type: 'int' },
        { id: crypto.randomUUID(), name: 'email', type: 'string' },
        { id: crypto.randomUUID(), name: 'createdAt', type: 'DateTime' },
      ],
    },
  },
]
</script>

<template>
  <div class="canvas-wrapper">
    <AppSidebar />
    <div class="canvas-area">
      <VueFlow
        id="main-canvas"
        :nodes="initialNodes"
        :node-types="nodeTypes"
        :edge-types="edgeTypes"
        :connection-mode="ConnectionMode.Loose"
        fit-view-on-init
      />
    </div>
    <EntityEditorPanel />
    <RelationshipEditorPanel />
  </div>
</template>

<style scoped>
.canvas-wrapper {
  display: flex;
  width: 100%;
  height: 100vh;
}

.canvas-area {
  flex: 1;
  height: 100%;
}
</style>
