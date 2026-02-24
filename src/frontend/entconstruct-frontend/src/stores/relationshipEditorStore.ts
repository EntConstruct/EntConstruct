import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useEntityEditorStore } from './entityEditorStore'

export const useRelationshipEditorStore = defineStore('relationshipEditor', () => {
  const isRelationshipPanelOpen = ref(false)
  const selectedEdgeId = ref<string | null>(null)

  function openRelationshipPanel(edgeId: string) {
    // Close entity panel if open to avoid both panels stacking
    useEntityEditorStore().closePanel()
    selectedEdgeId.value = edgeId
    isRelationshipPanelOpen.value = true
  }

  function closeRelationshipPanel() {
    isRelationshipPanelOpen.value = false
    selectedEdgeId.value = null
  }

  return { isRelationshipPanelOpen, selectedEdgeId, openRelationshipPanel, closeRelationshipPanel }
})
