# HealthPopulation AI

**Population Health & Chronic Disease Intelligence — frontend-only enterprise portfolio demo**

HealthPopulation AI demonstrates how a synthetic health-system population can be segmented into risk/cohort views and connected to explainable patient drill-down, care-gap management, outreach, screening campaigns, care-manager workflows, structured care plans, tasks, analytics, data freshness, notifications, and audit.

All people, risk signals, healthcare records, messages, integrations, outcomes, and AI outputs are fictional/deterministic demo data. The project does not diagnose, prescribe, deny care, call a real healthcare system, or send real outreach.

## Visual identity

- Midnight Aubergine `#372A45`
- Population Emerald `#2E8A72`
- Preventive Gold `#C99A42`
- Population Blue `#4E79A7`
- Risk Rose `#B85867`
- AI Violet `#635BB5`

## Custom dropdowns

The final project does **not** use native HTML `<select>` / `<option>` controls in runtime source. Shared `CustomSelect` supports keyboard navigation, Escape, outside-click close, disabled options, selected-state indication, and ARIA listbox/option semantics.

## Main demo workflows

### Diabetes outreach

1. Open **Population Health Overview**.
2. Open the High Diabetes Risk workflow / Cohorts.
3. Use the high-risk + overdue-follow-up + >30-day-contact rules.
4. Open **Maria Collins (PH-20418)**.
5. Review patient-specific risk evidence and source records.
6. Create simulated outreach and assign Olivia Bennett.
7. Mark outreach Contacted.
8. Schedule the Diabetes Review using a selected demo date.
9. Verify the care gap, patient timeline, cohort state, notifications, and audit update.

### Cardiovascular screening campaign

1. Open Outreach / Campaigns.
2. Create **Cardiovascular Screening Recovery** from the overdue screening cohort.
3. Preview a non-zero synthetic audience and select a simulated channel.
4. Launch the demo campaign.
5. Simulate deterministic responses.
6. Verify scheduled/completed screening changes and campaign analytics.

### Readmission / care management

1. Open Readmission Risk and select **James Turner**.
2. Review synthetic recent admission, missing follow-up, and medication-review context.
3. Assign care management / create follow-up work.
4. Verify patient, task, plan, timeline, and audit continuity.

### High utilization

Open High Utilization, select a patient without an active plan, create a structured Active Management plan, and verify the linked follow-up task and status transition.

## Roles

Use the top-bar custom role selector to simulate:

- Population Health Director
- Care Manager
- Primary Care Clinician
- Chronic Disease Nurse
- Preventive Care Coordinator
- Analyst
- Administrator

Meaningful mutation permissions are enforced in both UI and store actions.

## Run locally

```bash
npm ci
npm run dev
```

Production/build checks:

```bash
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

Playwright automatically starts the Vite application on its E2E port.

## Persistence / reset

Useful demo workflow state persists in localStorage under `healthpopulation-demo-v2`.

Switch to **Administrator** → Settings → Demo Controls to reset the deterministic seed state.

## Project documentation

- `docs/MASTER_PROMPT_ACCEPTANCE.md` — evidence-based master-prompt coverage
- `docs/FINAL_IMPLEMENTATION_REPORT.md` — architecture/workflow report
- `docs/VERIFICATION.md` — executed vs local runtime verification

## Important limitation

This completion environment could not retrieve all npm dependencies, so build/Vitest/Playwright execution is intentionally **not** claimed as passing here. Run the commands above in the target development environment before runtime release sign-off.
