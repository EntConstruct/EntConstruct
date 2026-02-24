export type RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-many'

export interface EntityRelationshipData {
  type: RelationshipType
  reversed?: boolean                // only for one-to-many: flips the 1 and N sides
  navigationPropertyName?: string   // only for one-to-many: property name on the N-side entity
  junctionTableName?: string        // only for many-to-many
}
