export type DataRecord = Record<
  string,
  string | number | boolean | string[] | null
>

export type QueryResult<T extends DataRecord = DataRecord> = {
  rows: T[]
  total: number
  executionTimeMs: number
}

export type PaginationState = {
  page: number
  pageSize: number
}

export type SortDirection = "asc" | "desc"

export type SortState = {
  field: string
  direction: SortDirection
}
