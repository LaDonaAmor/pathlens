import seedrandom from "seedrandom"
import type { DataRecord } from "@/types/results"

const rng = seedrandom("pathlens-products-2025")

function rand() {
  return rng()
}
function randInt(min: number, max: number) {
  return Math.floor(rand() * (max - min + 1)) + min
}
function rnd<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}
function randDate(from: Date, to: Date): string {
  const ms = from.getTime() + rand() * (to.getTime() - from.getTime())
  return new Date(ms).toISOString().split("T")[0]
}

const productNames = [
  "Lens API",
  "Query Studio",
  "Data Sync",
  "Insight Pack",
  "Audit Trail",
  "Workflow Core",
  "Analytics Hub",
  "Pipeline Pro",
  "Schema Mapper",
  "Report Engine",
  "Event Stream",
  "Access Guard",
]

const categories = ["software", "hardware", "service", "training"]
const tags = ["new", "bestseller", "deprecated", "beta", "stable", "enterprise"]

function generateProducts(n = 70): DataRecord[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 501,
    name: `${rnd(productNames)} ${i + 1}`,
    category: rnd(categories),
    price: parseFloat((rand() * 2000 + 9).toFixed(2)),
    stock: randInt(0, 200),
    rating: parseFloat((rand() * 4 + 1).toFixed(1)),
    active: rand() > 0.2,
    isFeatured: rand() > 0.7,
    tag: rnd(tags),
    createdAt: randDate(new Date("2020-01-01"), new Date("2025-01-01")),
  }))
}

export const mockProducts = generateProducts(70)
