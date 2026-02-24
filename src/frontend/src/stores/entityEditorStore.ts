import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEntityEditorStore = defineStore('entityEditor', () => {
  const isPanelOpen = ref(false)
  const selectedNodeId = ref<string | null>(null)

  function openPanel(nodeId: string) {
    selectedNodeId.value = nodeId
    isPanelOpen.value = true
  }

  function closePanel() {
    isPanelOpen.value = false
    selectedNodeId.value = null
  }

  return { isPanelOpen, selectedNodeId, openPanel, closePanel }
})