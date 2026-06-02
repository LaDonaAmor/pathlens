import { QueryBuilder } from "@/components/query-builder/QueryBuilder"

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export default async function BuilderPage() {
  await wait(1400)
  return <QueryBuilder />
}
