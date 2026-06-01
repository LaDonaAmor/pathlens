import seedrandom from "seedrandom"
import type { DataRecord } from "@/types/results"

const rng = seedrandom("pathlens-orders-2025")

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

const customers = [
  "Ada Okafor",
  "Tunde Bello",
  "Nia Mensah",
  "Amina Yusuf",
  "Kofi Boateng",
  "Zara Johnson",
  "Emeka Eze",
  "Fatima Hassan",
  "Chidi Okeke",
  "Yemi Adeyemi",
  "Priya Patel",
  "Carlos Rivera",
]

const statuses = ["paid", "pending", "refunded", "failed"]
const channels = ["web", "mobile", "retail"]
const currencies = ["USD", "GBP", "NGN", "GHS", "KES"]
const couponCodes = ["SAVE10", "VIP20", "FIRST50", null, null, null]

function generateOrders(n = 80): DataRecord[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i + 1001,
    customer: rnd(customers),
    total: parseFloat((rand() * 2000 + 10).toFixed(2)),
    status: rnd(statuses),
    channel: rnd(channels),
    currency: rnd(currencies),
    itemCount: randInt(1, 12),
    hasDiscount: rand() > 0.6,
    coupon: rnd(couponCodes),
    createdAt: randDate(new Date("2022-01-01"), new Date("2025-04-30")),
  }))
}

export const mockOrders = generateOrders(80)
