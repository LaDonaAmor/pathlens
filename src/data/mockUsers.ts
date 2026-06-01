import seedrandom from "seedrandom"
import type { DataRecord } from "@/types/results"

const rng = seedrandom("pathlens-2025")

function rand(): number {
  return rng()
}

function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min
}

function rnd<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

function randDate(from: Date, to: Date): string {
  const ms = from.getTime() + rand() * (to.getTime() - from.getTime())
  return new Date(ms).toISOString().split("T")[0]
}

const firstNames = [
  "Ada",
  "Tunde",
  "Nia",
  "Amina",
  "Kofi",
  "Zara",
  "Emeka",
  "Fatima",
  "Chidi",
  "Yemi",
  "Sola",
  "Bisi",
  "Kemi",
  "Tobi",
  "Dayo",
  "Seun",
  "James",
  "Sarah",
  "Carlos",
  "Mei",
  "Priya",
  "Omar",
  "Lena",
  "Ivan",
]

const lastNames = [
  "Okafor",
  "Bello",
  "Mensah",
  "Yusuf",
  "Boateng",
  "Johnson",
  "Eze",
  "Hassan",
  "Adeyemi",
  "Nwosu",
  "Smith",
  "Rivera",
  "Chen",
  "Patel",
  "Diallo",
  "Kimani",
  "Mokoena",
  "Owusu",
  "Traoré",
  "Nakamura",
]

const countries = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United States",
  "United Kingdom",
  "Canada",
  "India",
]

const statuses = ["active", "inactive", "pending"]

const roles = ["viewer", "editor", "manager", "analyst"]

const tagOptions = [
  "vip",
  "beta-user",
  "churned",
  "high-value",
  "referral",
  "enterprise",
  "trial",
  "returning",
]

function generateUsers(n = 120): DataRecord[] {
  return Array.from({ length: n }, (_, i) => {
    const firstName = rnd(firstNames)
    const lastName = rnd(lastNames)

    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randInt(1, 99)}@example.com`,
      age: randInt(18, 75),
      country: rnd(countries),
      status: rnd(statuses),
      role: i < 3 ? "admin" : rnd(roles),
      purchases: randInt(0, 150),
      revenue: parseFloat((rand() * 10000).toFixed(2)),
      isVerified: rand() > 0.3,
      isPremium: rand() > 0.6,
      createdAt: randDate(new Date("2020-01-01"), new Date("2024-12-01")),
      lastLogin: randDate(new Date("2024-01-01"), new Date("2025-05-30")),
      tags: [rnd(tagOptions)],
    }
  })
}

export const mockUsers = generateUsers(120)
