# HealthPopulation AI — Master Prompt Acceptance Matrix

This checklist translates all 143 numbered master-prompt sections into auditable product gates. A gate is complete only when source evidence and runtime/test evidence both exist.

## Product and safety foundation (1–24)

- [x] Frontend-only React/TypeScript/Vite product; no backend, real integrations, patient data, or AI API.
- [x] Synthetic aggregate population of 128,420 plus a small deterministic detailed-patient layer.
- [x] Central Zustand state connects patient, gap, outreach, task, care-plan, campaign, analytics, and audit views.
- [x] Useful workflow state persists in localStorage; Administrator can restore deterministic seed state.
- [x] Responsible language consistently identifies demo risk signals, care-team review, and non-clinical use.
- [x] Midnight Aubergine design system and specified semantic emerald/gold/blue/rose/violet palette.
- [x] Desktop-first application shell, grouped navigation, organization context, reporting period, role selector, global search, alert affordance, and demo badge.
- [x] Every role has an exact allow/deny matrix covered by automated permission tests and mutation controls consume it.

## Population, patient, and risk intelligence (25–56)

- [x] Executive overview with all seeded KPIs, trends/context, risk distribution, chronic-condition overview, AI insight, and meaningful charts.
- [x] Patient registry includes named columns, working search, risk filter, empty state, and patient drill-down.
- [x] Registry filters for age, condition, care gap, adherence, readmission, utilization, last contact, and care manager.
- [x] Patient header, ten named tabs, overview, traceable risk evidence, care gaps, management status, outreach entry point, and unified timeline.
- [x] Risk stratification and dedicated Diabetes, Cardiovascular, Hypertension, Readmission, and High Utilization population pages.
- [x] Cautionary adherence language and explainable tiers rather than unexplained numeric clinical scores.
- [x] Dedicated medication-adherence population view with medication/refill/contact fields and cautionary language.

## Cohorts and care gaps (57–66)

- [x] Functional AND-rule cohort builder with required example yielding the seeded 742 estimate.
- [x] Save cohort interaction and saved-cohort navigation.
- [x] Dynamic detailed cohort membership derives from current patient and care-gap state.
- [x] Care-gap table, all eight statuses, schedule/complete workflow, timeline history, and audit events.
- [x] Persist fully structured saved cohorts (name, description, owner, refresh behavior) in shared store.
- [x] Human override workflow: defer/dismiss/resolve with external evidence and reason.

## Outreach, campaigns, care management, and screening (67–85)

- [x] Patient outreach modal supports five channels, owner, reason, follow-up, queue continuity, contact status, timeline, and audit.
- [x] Seeded cardiovascular campaign supports launch, deterministic response simulation, metrics, patient screening updates, and audit.
- [x] Add campaign builder with cohort, preview, channel, audience validation, draft creation, and launch.
- [x] Explicit campaign close action and store-level closed-state relaunch guard.
- [x] Care-plan creation moves patient from Unmanaged to Active Management and prevents contradictory state.
- [x] Follow-up task creation/completion with duplicate-completion guard and audit.
- [x] Preventive screening overview and open → scheduled → completed workflow.
- [x] Dedicated care-manager workspace with assigned patients, today's tasks, priority metrics, and outreach queue.

## Intelligence, data, governance, and traceability (86–107)

- [x] AI insight feed includes affected population, evidence, rationale/action, safety label, and cohort affordance.
- [x] Population trend and outcome analytics; no false causal outcome claims.
- [x] Unified patient timeline across source and operational events.
- [x] Six source cards with simulated status/freshness/completeness and responsible data-quality warning.
- [x] Deterministic AI service module exposes cohort/risk/gap/utilization/explainability functions.
- [x] Split AI service façade into the named domain modules requested by section 98.
- [x] Audit trail records user, role, subject, action, previous, new, and timestamp.
- [x] Functional notifications panel includes workflow and data-freshness alerts.

## Interaction quality and enterprise controls (108–134)

- [x] Success microinteractions, modal with backdrop/Escape-compatible browser behavior, useful empty states, focus indicators, non-color risk labels, reduced-motion support, and responsive layouts.
- [x] Explicit focus trap, focus restoration, and Escape close behavior tested for both application modals.
- [x] Core population tables include sticky headers, risk/name sorting, pagination, row selection, and controlled bulk actions.
- [x] Bulk outreach selection creates a validated campaign draft and updates campaign membership/count.
- [x] Representative records avoid rendering 128,420 rows; aggregates remain separate and performant.
- [x] Exercisable source loading, unavailable, freshness warning, retry, empty, and missing-record states.
- [x] All 13 named design-specific reusable components exist; risk, gap, and campaign components are integrated into live views.

## Scenarios, invalid states, and verification (119–143)

- [x] Diabetes state path is represented: overview → cohort → Maria → explanation → outreach → manager → schedule → updated gap/audit/count.
- [x] Cardiovascular path is represented: overdue cohort → campaign → launch → responses → scheduled gaps/analytics.
- [x] Readmission, hypertension, high-utilization, and cohort-builder named patients/scenarios are seeded and actionable.
- [x] Guards cover completed gaps/tasks and empty/non-draft campaign launch; active care management has a single state.
- [x] Guards/tests for already-scheduled patient, externally resolved gap, zero-audience campaign, closed campaign relaunch, duplicate care plan/task, and invalid cohort rules.
- [x] Route rendering, patient drill-down, campaign validation, permission matrix, cohort persistence, override, duplicate care-plan, campaign, task, reset, and AI-service tests.
- [x] Bulk campaign action has route/UI regression coverage.
- [x] Automated coverage proves outreach queue/timeline/audit continuity, screening open → scheduled → completed history, and care-plan audit detail.
- [ ] Browser-level E2E tests required for the three named end-to-end scenarios.
- [ ] Manual QA required at 1440px, 1280px, and tablet with no console errors, dead buttons, broken routes, contradictory state, or encoding issues.

## Current authoritative evidence

- Production compilation: `npm run build`.
- Deterministic state and AI regression suite: `npm test`.
- Source implementation: `src/App.tsx`, `src/store.ts`, `src/data.ts`, `src/services/ai/`.
- Runtime persistence key: `healthpopulation-demo-v1`.
- Current regression result: 49/49 tests passing across 23 named routes plus connected store behavior.
- Production build is split into application, React vendor, and chart bundles; no chunk exceeds the configured warning threshold.

This file intentionally leaves unproven requirements unchecked. The goal is not complete until every box is checked with matching evidence.
