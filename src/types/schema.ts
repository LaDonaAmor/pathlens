export type FieldType = "string" | "number" | "boolean" | "date" | "enum"

export type SchemaField = {
  key: string
  label: string
  type: FieldType
  options?: string[]
}

export type DataSchema = {
  id: string
  label: string
  description: string
  fields: SchemaField[]
}
