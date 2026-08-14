import { act, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { useAppStore } from "./store";

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverMock);

const renderRoute = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>,
  );

describe("route-level product QA", () => {
  beforeEach(() => {
    useAppStore.getState().reset();
    useAppStore.getState().setRole("Population Health Director");
  });

  const routes: [string, string][] = [
    ["/", "Population Health Overview"],
    ["/patients", "Patient Registry"],
    ["/risk", "Risk Stratification"],
    ["/cohorts", "Cohorts"],
    ["/care-gaps", "Care Gaps"],
    ["/utilization", "High Utilization"],
    ["/adherence", "Medication Adherence Risk"],
    ["/diabetes", "Diabetes Population"],
    ["/cardiovascular", "Cardiovascular Health"],
    ["/hypertension", "Hypertension Management"],
    ["/readmission", "Readmission Risk"],
    ["/outreach", "Outreach"],
    ["/care-management", "Care Manager Workspace"],
    ["/care-plans", "Care Plans"],
    ["/tasks", "Follow-up Tasks"],
    ["/screening", "Preventive Screening"],
    ["/insights", "AI Insights"],
    ["/trends", "Population Trends"],
    ["/outcomes", "Outcome Analytics"],
    ["/data-sources", "Population Data Sources"],
    ["/integrations", "Integrations"],
    ["/audit", "Audit Trail"],
    ["/settings", "Settings"],
  ];

  it.each(routes)("renders %s without a broken route", (route, heading) => {
    renderRoute(route);
    expect(
      screen.getByRole("heading", { name: heading, level: 1 }),
    ).toBeTruthy();
  });

  it("renders the named synthetic patient drill-down", () => {
    renderRoute("/patients/PH-20418");
    expect(screen.getByRole("heading", { name: "Maria Collins" })).toBeTruthy();
    expect(screen.getByText("Rising synthetic HbA1c trend")).toBeTruthy();
    expect(screen.getByText(/Not validated for clinical use/)).toBeTruthy();
  });

  it("opens campaign builder and validates a non-empty audience", () => {
    renderRoute("/outreach");
    fireEvent.click(screen.getByRole("button", { name: "Create campaign" }));
    expect(
      screen.getByRole("dialog", { name: "Create outreach campaign" }),
    ).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Audience"), {
      target: { value: "0" },
    });
    expect(screen.getByRole("alert").textContent).toContain(
      "no eligible patients",
    );
    expect(screen.getByRole("button", { name: "Create draft" })).toBeDisabled();
  });
  it("traps focus and closes campaign dialog with Escape", () => {
    renderRoute("/outreach");
    fireEvent.click(screen.getByRole("button", { name: "Create campaign" }));
    const dialog = screen.getByRole("dialog", {
      name: "Create outreach campaign",
    });
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.queryByRole("dialog", { name: "Create outreach campaign" }),
    ).toBeNull();
  });

  it("focuses and closes patient outreach modal with Escape", () => {
    renderRoute("/patients/PH-20418");
    fireEvent.click(screen.getByRole("button", { name: /Create outreach/ }));
    const dialog = screen.getByRole("dialog", {
      name: "Create patient outreach",
    });
    expect(dialog.contains(document.activeElement)).toBe(true);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.queryByRole("dialog", { name: "Create patient outreach" }),
    ).toBeNull();
  });

  it("disables patient mutation controls for Analyst", () => {
    useAppStore.getState().setRole("Analyst");
    renderRoute("/patients/PH-20418");
    expect(
      screen.getByRole("button", { name: /Create outreach/ }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /Assign manager/ }),
    ).toBeDisabled();
  });

  it("opens the functional notifications panel", () => {
    renderRoute("/patients");
    fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
    expect(
      screen.getByRole("region", { name: "Notifications panel" }),
    ).toBeTruthy();
    expect(screen.getByText("High-risk cohort increased")).toBeTruthy();
  });

  it("adds selected registry patients to a controlled campaign draft", () => {
    renderRoute("/patients");
    fireEvent.click(
      screen.getByRole("checkbox", { name: "Select Maria Collins" }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Add to outreach campaign" }),
    );
    expect(useAppStore.getState().campaigns[0]).toMatchObject({
      cohort: "Selected Registry Patients",
      targeted: 1,
      status: "Draft",
    });
  });
  it("exercises explicit source loading, error, and recovery states", () => {
    vi.useFakeTimers();
    renderRoute("/data-sources");
    fireEvent.click(screen.getByRole("button", { name: "Refresh all" }));
    expect(screen.getByRole("status").textContent).toContain(
      "Calculating population view",
    );
    act(() => vi.runAllTimers());
    fireEvent.click(
      screen.getByRole("button", { name: "Simulate source issue" }),
    );
    expect(screen.getByRole("alert").textContent).toContain(
      "Data source unavailable",
    );
    fireEvent.click(screen.getByRole("button", { name: "Retry connection" }));
    expect(screen.queryByRole("alert")).toBeNull();
    vi.useRealTimers();
  });
});
