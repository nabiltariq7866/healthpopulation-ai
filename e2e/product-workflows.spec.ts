import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test("diabetes: population to outreach, assignment and scheduled care gap", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on(
    "console",
    (message) => message.type() === "error" && errors.push(message.text()),
  );
  await page.goto("/");
  await page.getByRole("button", { name: /High diabetes risk/ }).click();
  await expect(
    page.getByRole("heading", { name: "Diabetes Population" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Open Maria Collins" }).click();
  await expect(page.getByText("Rising synthetic HbA1c trend")).toBeVisible();
  await page.getByRole("button", { name: "Create outreach" }).click();
  await page
    .getByRole("dialog", { name: "Create patient outreach" })
    .getByRole("button", { name: "Create outreach" })
    .click();
  await page.getByRole("button", { name: "Assign manager" }).click();
  await page.getByRole("button", { name: "Schedule" }).click();
  await expect(
    page.getByText("Scheduled", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("link", { name: "Outreach" }).click();
  await expect(
    page.getByRole("cell", { name: "Diabetes Review" }).first(),
  ).toBeVisible();
  expect(errors).toEqual([]);
});

test("screening campaign: launch, simulate responses and update screening gap", async ({
  page,
}) => {
  await page.goto("/outreach");
  const campaign = page
    .locator(".campaign")
    .filter({ hasText: "Cardiovascular Screening Recovery" })
    .first();
  await campaign.getByRole("button", { name: "Launch demo" }).click();
  await campaign.getByRole("button", { name: "Simulate responses" }).click();
  await expect(campaign.getByText("210Responses")).toBeVisible();
  await expect(campaign.getByText("120Scheduled")).toBeVisible();
  await page.goto("/patients/PH-22146");
  await expect(
    page.getByText("Scheduled", { exact: true }).first(),
  ).toBeVisible();
});

test("cohort builder: save, open and add selected patient to campaign", async ({
  page,
}) => {
  await page.goto("/cohorts");
  await expect(page.getByText("742", { exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Save cohort" }).click();
  await expect(page.getByText(/COH-2026-/).first()).toBeVisible();
  await page.goto("/patients");
  await page.getByRole("checkbox", { name: "Select Maria Collins" }).check();
  await page.getByRole("button", { name: "Add to outreach campaign" }).click();
  await page.goto("/outreach");
  await expect(page.getByText("Registry outreach — 1 patients")).toBeVisible();
  await expect(
    page.getByText("Selected Registry Patients · 1 targeted"),
  ).toBeVisible();
});
