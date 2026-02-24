export interface EntityProperty {
  id: string
  name: string
  type: string
  description?: string
}

export interface EntityNodeData {
  name: string
  properties: EntityProperty[]
}