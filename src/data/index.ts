import { mockOrders } from "./mockOrders"
import { mockProducts } from "./mockProducts"
import { mockUsers } from "./mockUsers"

export const datasets = {
  users: mockUsers,
  orders: mockOrders,
  products: mockProducts,
}

export type DatasetId = keyof typeof datasets
