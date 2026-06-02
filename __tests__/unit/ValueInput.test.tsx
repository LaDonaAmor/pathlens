import { describe, expect, it, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { ValueInput } from "@/components/query-builder/ValueInput"
import type { SchemaField } from "@/types/schema"

const textField: SchemaField = { key: "name", label: "Name", type: "string" }
const numField: SchemaField = { key: "age", label: "Age", type: "number" }
const dateField: SchemaField = {
  key: "createdAt",
  label: "Created At",
  type: "date",
}
const enumField: SchemaField = {
  key: "status",
  label: "Status",
  type: "enum",
  options: ["active", "inactive", "pending"],
}
const boolField: SchemaField = {
  key: "isVerified",
  label: "Verified",
  type: "boolean",
}
const arrayField: SchemaField = {
  key: "tags",
  label: "Tags",
  type: "array",
  options: ["vip", "beta-user", "churned"],
}

describe("ValueInput", () => {
  it("shows 'No value needed' for operators without requireValue", () => {
    render(
      <ValueInput
        field={textField}
        operator="isNull"
        value={null}
        onChange={vi.fn()}
      />
    )
    expect(screen.getByText("No value needed")).toBeInTheDocument()
  })

  it("renders two inputs for 'between' operator", () => {
    render(
      <ValueInput
        field={numField}
        operator="between"
        value={[10, 20]}
        onChange={vi.fn()}
      />
    )
    expect(screen.getByLabelText("Age start value")).toBeInTheDocument()
    expect(screen.getByLabelText("Age end value")).toBeInTheDocument()
  })

  it("renders date inputs for 'between' on date fields", () => {
    render(
      <ValueInput
        field={dateField}
        operator="between"
        value={["2024-01-01", "2024-12-31"]}
        onChange={vi.fn()}
      />
    )
    const inputs = screen.getAllByRole("textbox")
    expect(inputs.length).toBeGreaterThanOrEqual(2)
    expect(inputs[0]).toHaveAttribute("type", "date")
  })

  it("renders checkboxes for 'in' on enum fields", () => {
    render(
      <ValueInput
        field={enumField}
        operator="in"
        value={["active"]}
        onChange={vi.fn()}
      />
    )
    expect(screen.getByText("active")).toBeInTheDocument()
    expect(screen.getByText("inactive")).toBeInTheDocument()
    expect(screen.getByText("pending")).toBeInTheDocument()
  })

  it("renders comma-separated input for 'in' on number fields", () => {
    render(
      <ValueInput
        field={numField}
        operator="in"
        value="1, 2, 3"
        onChange={vi.fn()}
      />
    )
    const input = screen.getByRole("textbox")
    expect(input).toHaveValue("1, 2, 3")
    expect(input).toHaveAttribute("placeholder", "e.g. 1, 2, 3")
  })

  it("renders select dropdown for enum fields", () => {
    render(
      <ValueInput
        field={enumField}
        operator="equals"
        value="active"
        onChange={vi.fn()}
      />
    )
    expect(screen.getByText("active")).toBeInTheDocument()
    expect(screen.getByText("inactive")).toBeInTheDocument()
    expect(screen.getByText("pending")).toBeInTheDocument()
  })

  it("renders boolean yes/no select", () => {
    render(
      <ValueInput
        field={boolField}
        operator="equals"
        value={true}
        onChange={vi.fn()}
      />
    )
    expect(screen.getByText("Yes")).toBeInTheDocument()
    expect(screen.getByText("No")).toBeInTheDocument()
  })

  it("renders array field as select dropdown", () => {
    render(
      <ValueInput
        field={arrayField}
        operator="inArray"
        value="vip"
        onChange={vi.fn()}
      />
    )
    expect(screen.getByText("vip")).toBeInTheDocument()
    expect(screen.getByText("beta-user")).toBeInTheDocument()
    expect(screen.getByText("churned")).toBeInTheDocument()
  })

  it("calls onChange when value changes", () => {
    const onChange = vi.fn()
    render(
      <ValueInput
        field={textField}
        operator="equals"
        value="hello"
        onChange={onChange}
      />
    )
    const input = screen.getByRole("textbox")
    fireEvent.change(input, { target: { value: "world" } })
    expect(onChange).toHaveBeenCalledWith("world")
  })

  it("renders number input for number field", () => {
    render(
      <ValueInput
        field={numField}
        operator="equals"
        value={25}
        onChange={vi.fn()}
      />
    )
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("type", "number")
    expect(input).toHaveValue(25)
  })

  it("renders date input for date field with equality operator", () => {
    render(
      <ValueInput
        field={dateField}
        operator="equals"
        value="2024-06-01"
        onChange={vi.fn()}
      />
    )
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("type", "date")
    expect(input).toHaveValue("2024-06-01")
  })

  it("handles checkbox toggle for 'in' operator on enum", () => {
    const onChange = vi.fn()
    render(
      <ValueInput
        field={enumField}
        operator="in"
        value={["active"]}
        onChange={onChange}
      />
    )
    fireEvent.click(screen.getByText("inactive"))
    expect(onChange).toHaveBeenCalledWith(["active", "inactive"])
  })
})
