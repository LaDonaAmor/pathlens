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
import { useQueryStore } from "@/store/queryStore"

export function useQueryBuilder() {
  const store = useQueryStore()

  const schema = useMemo(
    () => schemas.find((item) => item.id === store.schemaId) ?? schemas[0],
    [store.schemaId]
  )

  const dataset = datasets[store.schemaId as DatasetId]

  const sqlQuery = useMemo(
    () => generateSqlQuery(store.tree, schema.id),
    [store.tree, schema.id]
  )

  const mongoQuery = useMemo(() => generateMongoQuery(store.tree), [store.tree])

  const jsonQuery = useMemo(() => generateJsonQuery(store.tree), [store.tree])

  const result = useMemo(
    () => executeQuery(dataset, store.tree),
    [dataset, store.tree]
  )

  return {
    ...store,
    schema,
    dataset,
    sqlQuery,
    mongoQuery,
    jsonQuery,
    result,
  }
}
