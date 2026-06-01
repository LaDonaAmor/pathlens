"use client"

import { create } from "zustand"
import { schemas } from "@/data/schema"
import { generateId, moveItem } from "@/lib/utils"
import { getOperatorsForType } from "@/types/operators"
import type { Operator } from "@/types/operators"
import type { QueryGroup, QueryNode, QueryRule, QueryTree } from "@/types/query"

function getSchemaField(schemaId: string, fieldKey?: string) {
  const schema = schemas.find((item) => item.id === schemaId) ?? schemas[0]
  return schema.fields.find((item) => item.key === fieldKey) ?? schema.fields[0]
}

function getDefaultValue(fieldType: string) {
  if (fieldType === "boolean") return true
  if (fieldType === "number") return 0
  return ""
}

function createRule(schemaId: string, fieldKey?: string): QueryRule {
  const field = getSchemaField(schemaId, fieldKey)
  const operator = getOperatorsForType(field.type)[0].id

  return {
    id: generateId("rule"),
    type: "rule",
    field: field.key,
    operator,
    value: getDefaultValue(field.type),
  }
}

function createGroup(schemaId: string): QueryGroup {
  return {
    id: generateId("group"),
    type: "group",
    logic: "AND",
    collapsed: false,
    children: [createRule(schemaId)],
  }
}

function updateNode(
  node: QueryNode,
  nodeId: string,
  updater: (node: QueryNode) => QueryNode
): QueryNode {
  if (node.id === nodeId) return updater(node)
  if (node.type === "rule") return node

  return {
    ...node,
    children: node.children.map((child) => updateNode(child, nodeId, updater)),
  }
}

function updateGroupChildren(
  tree: QueryTree,
  groupId: string,
  updater: (children: QueryNode[]) => QueryNode[]
): QueryTree {
  return updateNode(tree, groupId, (node) => {
    if (node.type === "rule") return node

    return {
      ...node,
      children: updater(node.children),
    }
  }) as QueryTree
}

function removeNodeFromTree(node: QueryNode, nodeId: string): QueryNode | null {
  if (node.id === nodeId) return null
  if (node.type === "rule") return node

  return {
    ...node,
    children: node.children
      .map((child) => removeNodeFromTree(child, nodeId))
      .filter(Boolean) as QueryNode[],
  }
}

function replaceInvalidRulesForSchema(
  node: QueryNode,
  schemaId: string
): QueryNode {
  if (node.type === "rule") {
    const field = getSchemaField(schemaId, node.field)

    if (field.key === node.field) {
      const validOperators = getOperatorsForType(field.type)
      const operatorIsValid = validOperators.some(
        (operator) => operator.id === node.operator
      )

      return operatorIsValid
        ? node
        : {
            ...node,
            operator: validOperators[0].id,
            value: getDefaultValue(field.type),
          }
    }

    return createRule(schemaId)
  }

  return {
    ...node,
    children: node.children.map((child) =>
      replaceInvalidRulesForSchema(child, schemaId)
    ),
  }
}

export type QueryStoreState = {
  schemaId: string
  tree: QueryTree
  selectedNodeId: string | null
  setSchema: (schemaId: string) => void
  setTree: (tree: QueryTree) => void
  setSelectedNode: (nodeId: string | null) => void
  updateRule: (ruleId: string, patch: Partial<QueryRule>) => void
  setRuleField: (ruleId: string, field: string) => void
  setRuleOperator: (ruleId: string, operator: Operator) => void
  setGroupLogic: (groupId: string, logic: QueryGroup["logic"]) => void
  toggleGroup: (groupId: string) => void
  addRule: (groupId: string) => void
  addGroup: (groupId: string) => void
  removeNode: (nodeId: string) => void
  reorderChild: (groupId: string, fromIndex: number, toIndex: number) => void
  reset: () => void
}

export const useQueryStore = create<QueryStoreState>((set, get) => ({
  schemaId: "users",
  tree: createGroup("users"),
  selectedNodeId: null,

  setSchema: (schemaId) =>
    set((state) => ({
      schemaId,
      tree: replaceInvalidRulesForSchema(state.tree, schemaId) as QueryTree,
      selectedNodeId: null,
    })),

  setTree: (tree) => set({ tree }),

  setSelectedNode: (selectedNodeId) => set({ selectedNodeId }),

  updateRule: (ruleId, patch) =>
    set((state) => ({
      tree: updateNode(state.tree, ruleId, (node) =>
        node.type === "rule" ? { ...node, ...patch } : node
      ) as QueryTree,
    })),

  setRuleField: (ruleId, fieldKey) =>
    set((state) => {
      const field = getSchemaField(state.schemaId, fieldKey)
      const operator = getOperatorsForType(field.type)[0].id

      return {
        tree: updateNode(state.tree, ruleId, (node) =>
          node.type === "rule"
            ? {
                ...node,
                field: field.key,
                operator,
                value: getDefaultValue(field.type),
              }
            : node
        ) as QueryTree,
      }
    }),

  setRuleOperator: (ruleId, operator) =>
    set((state) => ({
      tree: updateNode(state.tree, ruleId, (node) =>
        node.type === "rule"
          ? {
              ...node,
              operator,
              value:
                operator === "isNull" || operator === "isNotNull"
                  ? null
                  : node.value,
            }
          : node
      ) as QueryTree,
    })),

  setGroupLogic: (groupId, logic) =>
    set((state) => ({
      tree: updateNode(state.tree, groupId, (node) =>
        node.type === "group" ? { ...node, logic } : node
      ) as QueryTree,
    })),

  toggleGroup: (groupId) =>
    set((state) => ({
      tree: updateNode(state.tree, groupId, (node) =>
        node.type === "group" ? { ...node, collapsed: !node.collapsed } : node
      ) as QueryTree,
    })),

  addRule: (groupId) =>
    set((state) => ({
      tree: updateGroupChildren(state.tree, groupId, (children) => [
        ...children,
        createRule(state.schemaId),
      ]),
    })),

  addGroup: (groupId) =>
    set((state) => ({
      tree: updateGroupChildren(state.tree, groupId, (children) => [
        ...children,
        createGroup(state.schemaId),
      ]),
    })),

  removeNode: (nodeId) =>
    set((state) => {
      if (state.tree.id === nodeId) return state

      return {
        tree: removeNodeFromTree(state.tree, nodeId) as QueryTree,
        selectedNodeId:
          state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      }
    }),

  reorderChild: (groupId, fromIndex, toIndex) =>
    set((state) => ({
      tree: updateGroupChildren(state.tree, groupId, (children) =>
        moveItem(children, fromIndex, toIndex)
      ),
    })),

  reset: () =>
    set({
      tree: createGroup(get().schemaId),
      selectedNodeId: null,
    }),
}))
