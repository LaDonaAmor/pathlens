import { screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"
import { RuleGroup } from "@/components/query-builder/RuleGroup"
import { activeAdultUsersQuery } from "@/test/fixtures/queryFixtures"
import { usersSchema } from "@/test/fixtures/schemaFixtures"
import { renderWithProviders } from "@/test/utils/renderWithProviders"

describe("RuleGroup", () => {
  it("renders recursive group controls and rules", () => {
    renderWithProviders(
      <RuleGroup
        group={activeAdultUsersQuery}
        fields={usersSchema.fields}
        issues={[]}
        isRoot
        onAddRule={vi.fn()}
        onAddGroup={vi.fn()}
        onRemove={vi.fn()}
        onToggle={vi.fn()}
        onLogicChange={vi.fn()}
        onFieldChange={vi.fn()}
        onOperatorChange={vi.fn()}
        onValueChange={vi.fn()}
        onReorder={vi.fn()}
      />
    )

    expect(screen.getByText("AND")).toBeInTheDocument()
    expect(screen.getAllByLabelText("Field").length).toBeGreaterThan(0)
  })
})
