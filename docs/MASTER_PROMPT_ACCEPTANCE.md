# HealthPopulation AI — Master Prompt Acceptance & Verification Matrix

This document is evidence-based. It separates **source implementation coverage** from **runtime verification**. It does not claim a build/test command passed unless that command was actually executed successfully in the current environment.

## Product and safety foundation (Master Prompt 1–24)

- [x] Frontend-only React/TypeScript/Vite application; no backend, real EHR/lab/pharmacy connection, real outreach provider, real AI API, real clinical model, or real patient data.
- [x] Synthetic aggregate population of 128,420 plus a small deterministic representative patient layer rather than 128k rendered rows.
- [x] Central Zustand state connects patients, cohorts, risk, care gaps, outreach, campaigns, tasks, structured care plans, data sources, notifications, and audit.
- [x] Useful workflow state persists through `localStorage` using `healthpopulation-demo-v2`; Administrator can restore deterministic seed state.
- [x] Responsible AI language preserves human review and avoids diagnosis, prescribing, denial, autonomous exclusion, or unsupported causal claims.
- [x] Midnight Aubergine / Emerald / Preventive Gold / Population Blue / Risk Rose / AI Violet visual system matches the supplied master prompt.
- [x] Desktop-first enterprise shell includes organization context, population/reporting context, global search, notifications, current role/user, and Demo Environment labeling.
- [x] Role permissions are enforced in the UI and protected again in state-changing store mutations where the action is permission-sensitive.
- [x] Audit actor is derived from the currently simulated user/role rather than being hard-coded to one user.

## Population, registry, patient, and risk intelligence (25–56)

- [x] Population Overview presents the seeded KPIs and state-aware changes, risk distribution, chronic disease overview, care-gap summary, AI insight, and meaningful charts.
- [x] Patient Registry includes prompt-aligned columns, search, sorting, pagination, row selection, controlled bulk actions, sticky-table styling, and real filters.
- [x] Registry filters cover age, condition, risk, care gap, medication concern, readmission, utilization, last contact, and care manager.
- [x] Global search covers patients, saved cohorts, and campaigns.
- [x] Patient detail includes the ten requested tabs with domain-specific synthetic records instead of repeating a generic placeholder list.
- [x] Patient detail exposes medications, screenings, utilization encounters, care gaps/history, outreach, structured care plan/tasks, and unified timeline.
- [x] Patient-level AI/risk explanations include traceable synthetic evidence, source label, and date.
- [x] Source Evidence Drawer is an accessible dialog with focus entry, focus trap, Escape close, backdrop close, focus return, and an explicit empty-evidence state.
- [x] Risk Stratification provides Overall, Diabetes, Cardiovascular, Readmission, Adherence, and Utilization views.
- [x] Human risk confirmation/change preserves the AI-assisted starting tier and requires a human-review reason.
- [x] Dedicated Diabetes, Cardiovascular, Hypertension, Readmission, Medication Adherence, and High Utilization views use domain-specific data/columns and cautious terminology.

## Cohorts and care gaps (57–66)

- [x] Cohort Builder supports Age, Condition, Risk, Care Gap, Screening, Medication Risk, Utilization, Recent Admission, and Last Contact rules.
- [x] Deterministic Diabetes + High Risk + Follow-up Overdue + Last Contact >30 days path maps to the seeded 742 aggregate example.
- [x] Invalid/zero-result cohort states are handled rather than silently saving an unusable cohort.
- [x] Saved cohorts persist structured name/description/owner/refresh behavior and can be reused in campaign workflows.
- [x] Detailed cohort membership derives from current patient/care-gap state so completed/resolved gaps stop qualifying where appropriate.
- [x] Care Gap workflow supports Open, Outreach Planned, Contacted, Scheduled, In Progress, Completed, Unable to Reach, and Deferred.
- [x] Scheduling uses a selected synthetic date and synchronizes care gap, screening, appointment, patient timeline, notification, and audit state.
- [x] Human override/external-evidence resolution requires a reason and preserves the operational decision in audit/history.

## Outreach, campaigns, care management, tasks, and screening (67–85)

- [x] Patient Outreach captures patient, reason, channel, owner, message template, and follow-up date; entered follow-up data is persisted rather than hard-coded.
- [x] Five simulated channels are available: SMS, Phone, Email, Patient Portal, and Letter. No real message is sent.
- [x] Outreach status/history stays connected to the patient timeline, queue, care-gap workflow, notifications, and audit.
- [x] Campaign Builder supports cohort, preview/audience validation, channel, draft creation, launch, deterministic response simulation, close, and relaunch guards.
- [x] Campaign response simulation includes deterministic Interested / No Response / Declined / Already Completed examples plus aggregate analytics.
- [x] Campaign analytics expose targeted, delivered, responses, appointments scheduled, completed screenings, no response, and opted out.
- [x] Bulk registry selection can create a controlled outreach-campaign draft; CSV export creates a real frontend download instead of a toast-only action.
- [x] Care Manager Workspace shows assigned patients, today's tasks, follow-ups due, high priority, and outreach work.
- [x] Care Plan is a structured object with goals, monitoring, screening, follow-up, owner, start date, status, and linked task—not only a status flag.
- [x] Follow-up Tasks expose owner, due date, priority, source, all requested statuses, and duplicate-completion protection.
- [x] Preventive Screening supports Overview, Overdue, Scheduled, and Completed states with open → scheduled → completed continuity.

## Intelligence, analytics, data, governance, and traceability (86–107)

- [x] AI Insights use affected population, evidence, operational significance, recommended action, and review-cohort affordances.
- [x] Population Trends cover risk, care-gap closure, screening completion, outreach, readmission-risk cohort, and high utilization.
- [x] Outcome Analytics derive state-aware demo outcomes and avoid claiming AI caused clinical outcomes.
- [x] Data Sources include EHR, Laboratory, Pharmacy, Appointments, Encounters, and Screening with simulated status/freshness/completeness.
- [x] Data source unavailable/retry and stale-data warning states are exercisable; source changes are Administrator-controlled in shared state.
- [x] Data Quality section exposes complete records, missing demographics, missing recent encounter, unmatched medication record, and stale data plus cautious AI guidance.
- [x] Integrations remain clearly simulated and do not claim live healthcare connectivity.
- [x] Named AI service modules exist for population, diabetes, cardiovascular, readmission, adherence, care gap, utilization, cohort, outreach priority, population insight, and patient summary.
- [x] Important cohort/risk/care-gap/outreach outputs are deterministic rather than random.
- [x] Enterprise Audit records timestamp, current simulated user, role, patient/cohort/system subject, action, previous state, and new state.
- [x] Notifications are real shared state and update/read through the application.

## Interaction quality, enterprise controls, accessibility, and invalid states (108–134)

- [x] Major tables have functional filters; decorative filter controls were removed.
- [x] Native HTML `<select>` / `<option>` controls have been eliminated from runtime and E2E source.
- [x] Shared `CustomSelect` provides mouse/touch selection, Arrow Up/Down, Home/End, Enter/Space, Escape, outside-click close, disabled options, selected indication, and ARIA listbox/option semantics.
- [x] Primary dialogs have focus entry, focus trap, Escape handling, backdrop close, and focus restoration.
- [x] Source Evidence Drawer now follows the same accessible dialog behavior.
- [x] Risk/status information is communicated with text as well as color; focus styles and reduced-motion behavior are present.
- [x] Controlled bulk actions are non-destructive: campaign membership, manager assignment/follow-up workflow, and demo export.
- [x] Store guards cover unauthorized mutation, completed gaps/tasks, already scheduled state, duplicate care plan/task, empty campaign, closed campaign relaunch, and invalid cohort rules.
- [x] Unknown application routes render a recoverable Page Not Found state rather than a blank screen.
- [x] Representative patients keep the frontend performant while aggregate metrics communicate the 128,420 population scale.
- [x] Responsible Use panel communicates demo model, human review, data coverage, and validation context without turning the product into a cybersecurity/governance app.

## Named portfolio scenarios and automated evidence (119–143)

- [x] Diabetes scenario source path exists: Overview → High Diabetes Risk → Maria Collins → evidence → outreach → assignment → contact → selected-date review scheduling → gap/cohort/dashboard continuity.
- [x] Cardiovascular screening campaign source path exists: overdue cohort → campaign → launch → deterministic responses → scheduled/completed screening changes → analytics.
- [x] Readmission scenario is seeded around James Turner with admission/follow-up/medication-review context and actionable follow-up workflow.
- [x] Hypertension scenario is seeded around Robert Evans with synthetic BP trend, overdue review, manager/task/scheduling actions.
- [x] High Utilization scenario includes repeated ED/admission use and structured Active Management plan creation.
- [x] Cohort Builder scenario can create/save the High Diabetes Risk outreach-priority cohort and reuse it in outreach/campaign work.
- [x] Automated component/store/service tests are authored for routes, custom dropdowns, permissions, cohorts, care gaps, outreach, campaigns, care plans, tasks, screening, risk human review, data sources, reset, source evidence, and state continuity.
- [x] Playwright E2E tests are authored for the three required named scenarios plus custom-dropdown behavior.
- [x] Playwright configuration is portable: it uses Playwright Chromium and automatically starts Vite on the configured local port instead of hard-coding a Windows Chrome executable.

## Verification status in this environment

### Executed successfully here

- Source syntax parse: **PASS** (TypeScript/TSX parser; see `docs/VERIFICATION.md`).
- Local relative-import resolution: **PASS**.
- Native runtime HTML dropdown scan: **PASS — 0 `<select>` / `<option>` tags**.
- Playwright native `selectOption()` scan: **PASS — 0 calls**.
- ZIP/patch integrity: recorded at release packaging time.

### Authored but not executable in this sandbox

The sandbox could not complete `npm ci` because the npm dependency cache/registry was unavailable for required packages. Therefore the following commands are **NOT claimed as passed here**:

```bash
npm ci
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

Run them in the target development environment before applying a runtime-level 100% release stamp.

## Current authoritative source evidence

- Routes/UI: `src/App.tsx`
- Shared workflow state + persistence + permissions + audit: `src/store.ts`
- Synthetic aggregate/detail data: `src/data.ts`
- Domain models: `src/types.ts`
- Custom dropdown: `src/components/ui/CustomSelect.tsx`
- Reusable product components/evidence drawer: `src/components/product/ProductComponents.tsx`
- Deterministic AI services: `src/services/ai/`
- Unit/regression tests: `src/App.test.tsx`, `src/services/ai/populationAI.test.ts`
- Browser workflows: `e2e/product-workflows.spec.ts`
- Browser runner: `playwright.config.ts`
- Persistence key: `healthpopulation-demo-v2`
