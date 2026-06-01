"use client"

import { useMemo } from "react"
import { datasets, type DatasetId } from "@/data"
import { schemas } from "@/data/schema"
import { useQueryStore } from "@/store/queryStore"

export function useQueryBuilder() {
  const store = useQueryStore()
  const schema = useMemo(
    () => schemas.find((item) => item.id === store.schemaId) ?? schemas[0],
    [store.schemaId]
  )

  const dataset = datasets[store.schemaId as DatasetId]

  return {
    ...store,
    schema,
    dataset,
  }
}
