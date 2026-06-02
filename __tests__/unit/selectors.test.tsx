import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { OperatorSelector } from "@/components/query-builder/OperatorSelector"
import { FieldSelector } from "@/components/query-builder/FieldSelector"
import type { SchemaField } from "@/types/schema"

const fields: SchemaField[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "age", label: "Age", type: "number" },
  { key: "status", label: "Status", type: "enum", options: ["a", "b"] },
]

describe("FieldSelector", () => {
  it("renders all fields as options", () => {
    const onChange = vi.fn()
    render(
      <FieldSelector
        id="field"
        fields={fields}
        value="name"
        onChange={onChange}
      />
    )
    expect(screen.getByText("Name")).toBeInTheDocument()
    expect(screen.getByText("Age")).toBeInTheDocument()
    expect(screen.getByText("Status")).toBeInTheDocument()
  })

  it("calls onChange when a different field is selected", () => {
    const onChange = vi.fn()
    render(
      <FieldSelector
        id="field"
        fields={fields}
        value="name"
        onChange={onChange}
      />
    )
    fireEvent.change(screen.getByLabelText("Select field"), {
      target: { value: "age" },
    })
    expect(onChange).toHaveBeenCalledWith("age")
  })
})

describe("OperatorSelector", () => {
  it("shows only string operators for string field type", () => {
    render(
      <OperatorSelector
        id="op"
        fieldType="string"
        value="equals"
        onChange={vi.fn()}
      />
    )
    expect(screen.getByText("Equals")).toBeInTheDocument()
    expect(screen.getByText("Contains")).toBeInTheDocument()
    expect(screen.getByText("Starts with")).toBeInTheDocument()
    expect(screen.getByText("Regex")).toBeInTheDocument()
    expect(screen.queryByText("Greater than")).not.toBeInTheDocument()
    expect(screen.queryByText("Less than")).not.toBeInTheDocument()
  })

  it("shows only number operators for number field type", () => {
    render(
      <OperatorSelector
        id="op"
        fieldType="number"
        value="equals"
        onChange={vi.fn()}
      />
    )
    expect(screen.getByText("Greater than")).toBeInTheDocument()
    expect(screen.getByText("Less than")).toBeInTheDocument()
    expect(screen.getByText("Between")).toBeInTheDocument()
    expect(screen.queryByText("Contains")).not.toBeInTheDocument()
    expect(screen.queryByText("Starts with")).not.toBeInTheDocument()
    expect(screen.queryByText("Regex")).not.toBeInTheDocument()
  })

  it("calls onChange when operator changes", () => {
    const onChange = vi.fn()
    render(
      <OperatorSelector
        id="op"
        fieldType="number"
        value="greaterThan"
        onChange={onChange}
      />
    )
    fireEvent.change(screen.getByLabelText("Operator"), {
      target: { value: "lessThan" },
    })
    expect(onChange).toHaveBeenCalledWith("lessThan")
  })
})
