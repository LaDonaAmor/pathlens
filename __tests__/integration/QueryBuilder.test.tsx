import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { QueryBuilder } from "@/components/query-builder/QueryBuilder"
import { renderWithProviders } from "@/test/utils/renderWithProviders"

describe("QueryBuilder", () => {
  it("renders the visual query builder shell", () => {
    renderWithProviders(<QueryBuilder />)

    expect(screen.getByText("PathLens")).toBeInTheDocument()
    expect(screen.getByText("The PathLens Ledger")).toBeInTheDocument()
    expect(screen.getByText("Results")).toBeInTheDocument()
    expect(screen.getByText("Data Source")).toBeInTheDocument()
  })
})
