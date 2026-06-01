"use client"

import { useMemo } from "react"
import { datasets, type DatasetId } from "@/data"
import { schemas } from "@/data/schema"
import {
  generateMongoQuery,
  generateSqlQuery,
  generateJsonQuery,
} from "@/lib/queryEngine"
import { executeQuery } from "@/lib/queryExecutor"
import { sanitizeQueryTree } from "@/lib/sanitizer"
import { validateQueryTree } from "@/lib/validator"
import { useQueryStore } from "@/store/queryStore"
import type { QueryTree } from "@/types/query"

export function useQueryBuilder() {
  const store = useQueryStore()

  const schema = useMemo(
    () => schemas.find((item) => item.id === store.schemaId) ?? schemas[0],
    [store.schemaId]
  )

  const dataset = datasets[store.schemaId as DatasetId]

  const sanitizedTree = useMemo(
    () => sanitizeQueryTree(store.tree, schema.fields) as QueryTree,
    [store.tree, schema.fields]
  )

  const validationIssues = useMemo(
    () => validateQueryTree(store.tree, schema),
    [store.tree, schema]
  )

  const sqlQuery = useMemo(
    () => generateSqlQuery(sanitizedTree, schema.id),
    [sanitizedTree, schema.id]
  )

  const mongoQuery = useMemo(
    () => generateMongoQuery(sanitizedTree),
    [sanitizedTree]
  )

  const jsonQuery = useMemo(
    () => generateJsonQuery(sanitizedTree),
    [sanitizedTree]
  )

  const result = useMemo(
    () => executeQuery(dataset, sanitizedTree),
    [dataset, sanitizedTree]
  )

  return {
    ...store,
    schema,
    dataset,
    sanitizedTree,
    validationIssues,
    sqlQuery,
    mongoQuery,
    jsonQuery,
    result,
  }
}
