import { render } from "@testing-library/react"
import { ThemeProvider } from "@/providers/ThemeProvider"

export function renderWithProviders(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}
