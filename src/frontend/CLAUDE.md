# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Project Is
A VS Code extension webview UI for **EntConstruct** — a visual entity designer for .NET 8 / EF Core projects. Users design database entities and relationships on a graph canvas, then generate C# entity classes and EF Core configurations from it.

## Commands

All commands must be run from `entconstruct-frontend/`:

```sh
npm run dev          # Vite dev server with HMR
npm run build        # Type-check + production build (runs in parallel via npm-run-all2)
npm run build-only   # Production build without type-check
npm run type-check   # vue-tsc --build
npm run lint         # oxlint (fix) then eslint (fix), sequentially
```

No test framework is configured yet.

## Tech Stack
- **Vue 3** with Composition API (`<script setup>`)
- **TypeScript** throughout
- **@vue-flow/core** for the graph/canvas
- **Pinia** for global state
- **Monaco Editor** for diff viewing (planned)
- **Vite** as bundler; `@` alias resolves to `./src`
- No CSS framework — keep styles scoped per component

## Linting Setup
Two linters run in sequence via `npm run lint`:
1. `oxlint` (fast Rust linter) — configured via `.oxlintrc.json`
2. `eslint` — configured via `eslint.config.ts`, uses `@vue/eslint-config-typescript` + `eslint-plugin-vue` + `eslint-plugin-oxlint` (disables rules already covered by oxlint)

## Project Structure

The Vue app lives inside `entconstruct-frontend/src/`. Planned vs. current state:

```
src/
├── types/
│   └── entity.ts              # EntityProperty + EntityNodeData interfaces (implemented)
├── stores/
│   ├── index.ts               # Barrel export
│   └── entityEditorStore.ts   # Pinia store (implemented)
├── interfaces/                # Empty placeholder directory
├── services/                  # Empty placeholder directory
├── components/
│   └── EntityTable.vue        # Skeleton — planned to become canvas/ and panels/ subdirs
├── App.vue                    # Placeholder
└── main.ts
```

Planned component layout (not yet created):
- `components/canvas/EntityNode.vue` — custom Vue Flow node
- `components/panels/EntityEditorPanel.vue` — slide-in editor panel
- `views/CanvasView.vue` — root canvas view

## Core Types (`src/types/entity.ts`)
```ts
export interface EntityProperty {
  id: string        // crypto.randomUUID()
  name: string
  type: string      // plain string for now; will become a type picker later
  description?: string
}

export interface EntityNodeData {
  name: string
  properties: EntityProperty[]
}
```

## State Management

`useEntityEditorStore` (`src/stores/entityEditorStore.ts`):
```ts
{ isPanelOpen, selectedNodeId, openPanel(nodeId), closePanel() }
```
- Any component calls `openPanel(nodeId)` to open the editor panel
- Panel reads node data via `useVueFlow().findNode(selectedNodeId)`

## Component Architecture (planned)

### `EntityNode.vue` (custom Vue Flow node)
- Receives `props.data: EntityNodeData` and `props.id: string` from Vue Flow
- Read-only display; edit button appears on hover only
- Edit button → `store.openPanel(props.id)`
- Register as `{ entityNode: EntityNode }` in VueFlow node types

### `EntityEditorPanel.vue` (side panel)
- On open: deep-clones node data into a `localData` ref (never mutates graph directly)
- **Save** → `updateNodeData(nodeId, localData)` + `store.closePanel()`
- **Cancel** → `store.closePanel()` (local copy discarded)
- Add property → push blank `EntityProperty` with new UUID; remove → filter by `id`

### `CanvasView.vue` (root)
```html
<VueFlow :node-types="nodeTypes" />
<EntityEditorPanel />  <!-- sibling, reads store -->
```

## Key Conventions
- Always use `crypto.randomUUID()` for property IDs
- Never mutate Vue Flow node data directly — always use `updateNodeData`
- Panel edits a **local deep clone** — no live graph mutation during editing
- Keep `EntityNode` purely display-only; all write logic lives in `EntityEditorPanel`
- `type` on `EntityProperty` is intentionally a plain `string` — Roslyn-backed type picker is planned

## Backend Communication (out of scope for frontend)
- .NET CLI backend communicates via stdin/stdout
- Frontend sends entity graph → backend generates C# code
- Diff output (DiffPlex) shown in Monaco Editor before applying to files

## Planned Features
- **Relationship types**: one-to-one, one-to-many, many-to-many, self-referencing — will use Vue Flow edges with custom edge types
- **Monaco Editor** integration for diff review before file writes
- **Roslyn-backed type picker** replacing the plain `string` type field
