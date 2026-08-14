# HealthPopulation AI — Complete Frontend Product Demo Master Prompt

You are a Senior Frontend Engineer, Healthcare Product Architect, Population Health Product Designer, Chronic Disease Management Specialist, AI Workflow Designer, Healthcare Analytics Engineer, and Enterprise SaaS UI/UX Expert.

Your task is to build a polished portfolio product called:

# HealthPopulation AI
## Population Health & Chronic Disease Intelligence

HealthPopulation AI is an interactive healthcare intelligence platform designed to demonstrate how a health system, hospital network, insurer, integrated care organization, population-health team, or chronic-disease program could use unified patient data and AI-assisted analytics to identify risk earlier and manage populations proactively rather than relying only on reactive hospital care.

The platform should demonstrate how healthcare organizations could combine synthetic information from:

- EHR
- Laboratory
- Pharmacy
- Encounters
- Screening
- Appointments
- Care-management activity

to create population-level intelligence around:

- Diabetes risk
- Cardiovascular risk
- Readmission risk
- Chronic-disease deterioration
- Medication-adherence risk
- Preventive screening gaps
- High-utilization prediction
- Uncontrolled hypertension
- Care gaps
- Follow-up requirements
- Outreach opportunities

This application will be shown to prospective healthcare clients.

It must feel like a serious enterprise population-health product.

It must NOT feel like:

- a generic BI dashboard,
- a hospital admin template,
- a marketing analytics screen,
- a static dashboard,
- a simple chart collection,
- a CRM with healthcare terminology,
- or an AI chatbot attached to patient data.

The application must combine:

**Population Intelligence + Cohort Discovery + Patient Drill-Down + Care Management + Outreach + AI-Assisted Prioritization**

---

# 1. READ EVERYTHING BEFORE CODING

Before writing or changing code:

1. Read every provided reference document.
2. Inspect the complete project.
3. Review:
   - package.json
   - routes
   - global styles
   - state architecture
   - existing components
   - tables
   - charts
   - forms
   - mock data
   - utilities
   - tests
4. Understand what already exists.
5. Preserve good implementation.
6. Refactor instead of duplicating.
7. Reuse installed libraries when suitable.
8. Do not install duplicate dependencies unnecessarily.
9. Understand the complete population → cohort → outreach → follow-up workflow before implementation.
10. Do not build isolated screens.

If the repository is empty, create a clean modular architecture from the beginning.

---

# 2. CRITICAL PROJECT CONSTRAINT

THIS PROJECT IS FRONTEND ONLY.

Do NOT build:

- Django backend
- Node backend
- real database server
- real EHR integration
- real laboratory integration
- real pharmacy integration
- real insurance integration
- real FHIR server
- real risk model
- real clinical prediction engine
- real patient outreach service
- real SMS/email provider
- real AI API
- real patient information

All information must be synthetic.

However:

The application must behave like a connected production system.

Example:

Population dashboard shows 4,281 high-diabetes-risk patients
→ user opens cohort
→ filters to patients with overdue follow-up
→ opens one patient
→ reviews risk factors and source data
→ creates outreach task
→ assigns care manager
→ patient is contacted
→ screening appointment is scheduled
→ care-gap state becomes In Progress
→ cohort counts update
→ care-management dashboard updates.

This continuity is mandatory.

---

# 3. CORE PRODUCT PHILOSOPHY

HealthPopulation AI should help teams answer:

Who needs attention?

Why do they need attention?

Which populations are falling through care gaps?

Which patients should be contacted first?

Which preventive actions are overdue?

Which chronic-disease cohorts are deteriorating?

Where is healthcare capacity being consumed repeatedly?

Which outreach activities are working?

AI should assist with:

- risk stratification,
- cohort identification,
- care-gap detection,
- follow-up prioritization,
- high-utilization signals,
- adherence concerns,
- screening-gap identification,
- population trends,
- patient summaries,
- suggested outreach priorities.

AI must NOT:

- diagnose patients,
- prescribe medication,
- autonomously classify patients as medically unsafe,
- make irreversible clinical decisions,
- deny services,
- automatically change care plans.

Use language such as:

AI-assisted risk signal

Population-level prioritization

Potential care gap

Requires care-team review

Demo risk model

Not validated for clinical use

---

# 4. CORE DATA FLOW

The product architecture should represent:

EHR
+
Labs
+
Pharmacy
+
Appointments
+
Encounters
+
Screening
↓
Population Health Data Layer
↓
AI Intelligence Engine
↓
Risk Stratification
Care Gap Detection
Adherence Risk
Utilization Prediction
Screening Gaps
Chronic Disease Monitoring
↓
Population Segments / Cohorts
↓
Care Management
↓
Outreach
Screening
Follow-up
Care Tasks
Alerts
↓
Outcome Tracking

---

# 5. PRIMARY DEMO WORKFLOW

The strongest portfolio workflow must be:

Population Overview
↓
High Diabetes Risk Cohort
↓
Filter by Overdue Follow-Up
↓
Open Patient
↓
AI Explains Risk Factors
↓
Review Source Data
↓
Create Outreach
↓
Assign Care Manager
↓
Patient Contacted
↓
Screening / Review Scheduled
↓
Care Gap Status Updated
↓
Population Metrics Update

This workflow must work end-to-end.

---

# 6. SECOND DEMO WORKFLOW

Preventive Screening Gap:

Population dashboard
↓
Cardiovascular Screening Gap
↓
6,019 overdue patients
↓
Filter highest-priority patients
↓
Create Outreach Campaign
↓
Select patients
↓
Send simulated outreach
↓
Patients respond
↓
Screenings scheduled
↓
Gap status changes
↓
Campaign analytics update.

---

# 7. THIRD DEMO WORKFLOW

High Readmission Risk:

High Readmission Risk cohort
↓
Open patient
↓
Review recent admissions
↓
Open care gaps
↓
Medication-adherence concern
↓
Create care-manager follow-up
↓
Patient contacted
↓
Follow-up appointment scheduled
↓
Risk review status updated.

---

# 8. FOURTH DEMO WORKFLOW

Uncontrolled Hypertension:

Population cohort
↓
Filter repeated elevated synthetic BP records
↓
Identify patients without recent follow-up
↓
Care manager creates intervention queue
↓
Patients contacted
↓
Monitoring/review scheduled
↓
Cohort count decreases as gaps are addressed.

---

# 9. FIFTH DEMO WORKFLOW

High Utilization:

AI identifies patients with repeated emergency / hospital utilization
↓
User opens high-utilization cohort
↓
Patient timeline reviewed
↓
Outstanding care gaps identified
↓
Care-management plan created
↓
Follow-up task assigned
↓
Outreach completed
↓
Case moves into Active Management.

---

# 10. RECOMMENDED TECH STACK

Use:

- React
- TypeScript
- Vite
- React Router
- Zustand
- localStorage or IndexedDB
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Radix UI
- TanStack Table
- Recharts
- Lucide React
- Sonner
- date-fns
- Framer Motion only for subtle transitions

If equivalent technology already exists, reuse it.

Do not install dependencies simply because they are listed.

---

# 11. THIS PROJECT MUST HAVE ITS OWN VISUAL IDENTITY

DO NOT copy visual styling from:

CareOps AI

Clinician Copilot AI

SmartReferral AI

MedSafe AI

VirtualWard AI

HealthPopulation AI should feel like:

A sophisticated population intelligence platform.

It should visually communicate:

Scale
Segmentation
Risk
Prevention
Cohorts
Care gaps
Proactive management
Population trends

The visual design should feel more analytical and strategic than the previous clinical workflow products.

---

# 12. UNIQUE COLOR SYSTEM

Use:

## Midnight Aubergine
#372A45

Primary structural color.

Use for:

- sidebar
- top-level navigation
- major headings
- selected states

This gives HealthPopulation its own visual identity.

## Population Emerald
#2E8A72

Use for:

- healthy progress
- completed care gaps
- outreach completion
- positive cohort movement

## Preventive Gold
#C99A42

Use for:

- screening gaps
- follow-up required
- preventive-care attention

## Population Blue
#4E79A7

Use for:

- cohort analytics
- informational elements
- longitudinal data

## Risk Rose
#B85867

Use for:

- high-risk groups
- readmission signals
- significant deterioration risk

## Main Background
#F7F6F9

## Surface
#FFFFFF

## Secondary Surface
#F0EEF4

## Border
#DDD8E3

## Main Text
#282431

## Secondary Text
#6D6675

## AI Accent
#635BB5

## AI Soft Background
#F1EFFB

## Cohort Highlight
#EDF7F3

## Preventive Gap Background
#FBF5E8

---

# 13. COLOR DISTRIBUTION

Approximately:

75% neutral / white

15% aubergine / structural tones

10% semantic and intelligence colors

Do not create rainbow analytics.

Use consistent semantic meaning.

---

# 14. TYPOGRAPHY

Use:

Inter

or equivalent enterprise UI typography.

Suggested:

Page Title:
28–30px

Population KPI:
30–36px

Section Title:
18–20px

Body:
14px

Tables:
13–14px

Metadata:
12–13px

Risk label:
12–13px

---

# 15. APPLICATION SHELL

Suggested navigation:

HEALTHPOPULATION AI

POPULATION
- Population Overview
- Patient Registry

RISK & COHORTS
- Risk Stratification
- Cohorts
- Care Gaps
- High Utilization

CHRONIC CONDITIONS
- Diabetes
- Cardiovascular
- Hypertension
- Readmission

CARE MANAGEMENT
- Outreach
- Care Plans
- Follow-up Tasks
- Screening

INTELLIGENCE
- AI Insights
- Population Trends
- Outcome Analytics

SYSTEM
- Data Sources
- Integrations
- Audit Trail
- Settings

---

# 16. TOP BAR

Include:

Organization selector

Global patient/cohort search

Current reporting period

Alerts

Notifications

User profile

Demo Environment badge

Example:

Northshire Integrated Care Network

Population:
128,420

Current user:

Dr. Eleanor Hayes
Population Health Director

---

# 17. ROLE SIMULATION

Support:

Population Health Director

Care Manager

Primary Care Clinician

Chronic Disease Nurse

Preventive Care Coordinator

Analyst

Administrator

Permissions should meaningfully differ.

---

# 18. DEMO DATA

Create realistic synthetic data for:

Patients

Age groups

Conditions

Risk signals

Risk tiers

Labs

Medications

Medication adherence

Appointments

Encounters

Admissions

Readmissions

Screening history

Preventive-care requirements

Care gaps

Outreach history

Care-management tasks

Care managers

Clinicians

Cohorts

Campaigns

AI insights

Data sources

Audit records

---

# 19. POPULATION SIZE

Seed a realistic synthetic population:

128,420 patients

Use aggregated data plus a smaller detailed patient dataset underneath.

Do NOT create 128,420 huge patient objects if unnecessary.

Instead:

Use:

aggregated seeded metrics

+

representative synthetic detailed patients

+

deterministic cohort simulation.

Keep frontend performant.

---

# 20. CLIENT-REFERENCE SEEDED KPIS

Initial demo dashboard can include:

Population

128,420

High Diabetes Risk

4,281

Overdue Cardiovascular Screening

6,019

High Readmission Risk

1,203

Medication Adherence Risk

2,417

Uncontrolled Hypertension

3,842

These should be demo seed values.

Where practical, adjusted workflow counts should derive from state.

---

# 21. SHARED STATE

Use centralized state.

Suggested:

populationStore

patientStore

cohortStore

riskStore

careGapStore

outreachStore

campaignStore

taskStore

carePlanStore

analyticsStore

auditStore

---

# 22. STATE CONTINUITY

Example:

Patient marked:

Cardiovascular screening overdue.

After outreach:

Screening scheduled.

Then:

Care-gap state should become:

Scheduled / In Progress

The patient should update across:

Patient profile

Care Gap list

Outreach dashboard

Cohort

Population Overview.

---

# 23. DEMO PERSISTENCE

Persist useful demo state.

Use:

localStorage

or:

IndexedDB.

Store:

outreach actions

task statuses

campaign state

patient care-gap state

selected risk state

Do not persist unnecessary massive datasets.

---

# 24. RESET DEMO

Settings
→ Demo Controls
→ Reset Demo Data.

---

# 25. POPULATION OVERVIEW

This is the main executive screen.

Title:

Population Health Overview

Subtitle:

Proactive visibility across chronic-disease risk, preventive-care gaps, utilization and care-management activity.

---

# 26. TOP KPI AREA

Display:

Population

High-Risk Patients

Open Care Gaps

Screenings Overdue

Readmission Risk

Medication-Adherence Risk

Uncontrolled Hypertension

Active Outreach

Use sophisticated compact cards.

---

# 27. KPI CARD QUALITY

Each KPI should include:

Value

Percentage of population

Trend

Relevant context

Example:

High Diabetes Risk

4,281

3.3% of population

+4.2% this quarter

---

# 28. POPULATION RISK DISTRIBUTION

Visual:

Low Risk

Moderate Risk

High Risk

Priority Review

Use stacked visualization or refined segmented bars.

---

# 29. CHRONIC DISEASE OVERVIEW

Display:

Diabetes

Hypertension

Cardiovascular

COPD if needed

Other chronic conditions

Show:

population size

high-risk count

care gaps

active management

---

# 30. AI POPULATION INSIGHT

Example:

AI Population Insight

4,281 patients are currently classified within the High Diabetes Risk demo cohort.

742 of these patients also have an overdue follow-up requirement.

Recommended operational action:

Prioritize patients with both high-risk status and unresolved follow-up gaps.

Clearly label:

AI-generated population-management insight.

Not a clinical diagnosis.

---

# 31. CARE-GAP SUMMARY

Show categories:

Screening

Follow-up

Medication Review

Monitoring

Appointment

Lab Test

Preventive Check

---

# 32. POPULATION TREND CHARTS

Useful charts:

Risk Distribution

Care Gaps Over Time

Screening Completion

High Utilization

Chronic Disease Trend

Outreach Completion

Avoid decorative charts.

---

# 33. PATIENT REGISTRY

Create professional table.

Columns:

Patient

Age

Primary Conditions

Current Risk

Care Gaps

Last Encounter

Medication Risk

Utilization

Care Manager

Status

---

# 34. PATIENT SEARCH

Search:

Name

Patient ID

Condition

Care Manager

Cohort

---

# 35. REGISTRY FILTERS

Age

Condition

Risk

Care gap

Medication adherence

Readmission risk

Utilization

Last contact

Care manager

---

# 36. PATIENT DETAIL

Header:

Patient

Patient ID

Age

Primary Conditions

Population Risk Tier

Assigned Care Manager

---

# 37. PATIENT TABS

Overview

Risk Profile

Conditions

Care Gaps

Medications

Screenings

Utilization

Outreach

Care Plan

Timeline

---

# 38. PATIENT OVERVIEW

Show:

Conditions

Latest significant synthetic results

Current medications

Open care gaps

Risk signals

Recent hospital use

Care-management status

Recent outreach

---

# 39. AI PATIENT POPULATION SUMMARY

Example:

AI Population Summary

Patient is part of the High Diabetes Risk and Medication Adherence Risk cohorts.

Latest follow-up is overdue by 42 days.

The patient also has two emergency encounters during the last six months.

Recommended review:

Care-management follow-up.

Sources:

Laboratory Record

Medication History

Appointment History

Encounter Data

---

# 40. SOURCE TRACEABILITY

AI risk explanations should link to synthetic sources.

Example:

Elevated diabetes risk signal

Supporting data:

HbA1c trend
Lab Records

Medication refill gap
Pharmacy History

Overdue review
Appointment Record

---

# 41. RISK STRATIFICATION PAGE

Create:

Risk Stratification

Tabs:

Overall

Diabetes

Cardiovascular

Readmission

Adherence

Utilization

---

# 42. RISK TIERS

Use:

Low

Moderate

High

Priority Review

Avoid:

Critical unless appropriate for operational demo.

---

# 43. RISK EXPLAINABILITY

Click:

Why High Risk?

Show:

Risk Factors

Supporting Records

Recent Changes

Care Gaps

Data Freshness

Example:

Risk signal influenced by:

Rising synthetic HbA1c trend

Overdue follow-up

Medication refill gap

---

# 44. DO NOT DISPLAY UNEXPLAINED SCORES

Avoid:

Risk 93.72%

unless useful.

Prefer:

High Risk

with evidence.

---

# 45. DIABETES MODULE

Create dedicated population page.

Metrics:

Patients with diabetes

High-risk diabetes

Overdue follow-up

Monitoring gaps

Medication-adherence concerns

Recent elevated synthetic results

---

# 46. DIABETES COHORT TABLE

Patient

Latest Result

Trend

Medication Adherence

Last Review

Care Gap

Risk

Action

---

# 47. DIABETES AI INSIGHT

Example:

742 patients within the high-risk diabetes cohort also have overdue follow-up.

Prioritizing this combined cohort could concentrate care-management resources on patients with both elevated risk signals and unresolved care gaps.

---

# 48. CARDIOVASCULAR MODULE

Metrics:

Patients in cardiovascular cohort

High cardiovascular risk

Screening overdue

Recent admissions

Unresolved follow-up

---

# 49. SCREENING GAP

Use client seeded value:

6,019 overdue cardiovascular screening.

Create functional cohort.

---

# 50. HYPERTENSION MODULE

Metrics:

Patients with hypertension

Uncontrolled synthetic BP trend

Overdue review

Medication adherence concerns

Recent care-manager activity

Seed:

3,842 uncontrolled-hypertension demo patients.

---

# 51. READMISSION MODULE

Metrics:

High Readmission Risk

Recent Discharges

Follow-up Missing

Medication Review Needed

Repeated Admissions

Seed:

1,203 High Readmission Risk.

---

# 52. READMISSION PATIENT DETAIL

Show:

Recent admissions

Discharge date

Follow-up

Medication reconciliation

Open tasks

Care-manager contact

AI risk explanation

---

# 53. MEDICATION ADHERENCE RISK

Seed:

2,417 patients.

Display:

Medication

Refill gap indicator

Last reported adherence

Care-manager contact

Risk

---

# 54. ADHERENCE CAUTION

Do not assume:

refill gap = medication non-compliance.

Use:

Potential adherence concern

Requires review.

---

# 55. HIGH UTILIZATION

Create:

High Utilization

Define synthetic signals around repeated:

Emergency visits

Admissions

Unscheduled care

---

# 56. HIGH-UTILIZATION TABLE

Patient

ED Visits

Admissions

Last Encounter

Current Risk

Care Gaps

Assigned Manager

Action

---

# 57. COHORT BUILDER

One of the most impressive product features.

Create:

Cohort Builder

Allow user to build a population segment.

Filters:

Age

Condition

Risk

Care gap

Screening

Medication risk

Utilization

Recent admission

Last contact

---

# 58. COHORT EXAMPLE

Build:

High Diabetes Risk

AND

Follow-up Overdue

AND

No Contact in 30 Days

Result:

742 patients

---

# 59. SAVE COHORT

Button:

Save Cohort

Fields:

Name

Description

Owner

Refresh behavior

Example:

High Diabetes Risk — Overdue Review

---

# 60. SAVED COHORTS

Show:

Cohort

Population

Owner

Last Updated

Active Care Gaps

Outreach Status

---

# 61. DYNAMIC COHORT COUNTS

When patient status changes:

cohort count can update where appropriate.

Example:

Screening completed

→ removed from Overdue Screening cohort.

---

# 62. CARE GAPS MODULE

Create:

Care Gaps

Categories:

Screening Overdue

Follow-up Overdue

Medication Review

Monitoring Due

Lab Test Due

Care Plan Missing

---

# 63. CARE-GAP TABLE

Patient

Gap

Condition

Due Date

Overdue

Priority

Care Manager

Status

Action

---

# 64. GAP STATUS

Open

Outreach Planned

Contacted

Scheduled

In Progress

Completed

Unable to Reach

Deferred

---

# 65. RESOLVE CARE GAP

Example:

Overdue Cardiovascular Screening

Action:

Schedule Screening

Select date

Status becomes:

Scheduled

After simulated completion:

Completed.

---

# 66. CARE GAP HISTORY

Preserve:

Detected

Outreach

Contacted

Scheduled

Completed.

---

# 67. OUTREACH MODULE

Create:

Outreach

Views:

Work Queue

Campaigns

Patient Outreach

Results

---

# 68. OUTREACH QUEUE

Columns:

Patient

Reason

Cohort

Priority

Last Contact

Preferred Channel

Owner

Status

Action

---

# 69. CREATE OUTREACH

Button:

Create Outreach

Fields:

Patient

Reason

Channel

Assigned To

Message Template

Follow-up Date

---

# 70. OUTREACH CHANNELS

Simulate:

SMS

Phone

Email

Patient Portal

Letter

No real communication required.

---

# 71. OUTREACH STATUS

Planned

Sent

Contacted

No Response

Accepted

Declined

Scheduled

Completed

---

# 72. CAMPAIGN MODULE

Create:

Outreach Campaign

Example:

Cardiovascular Screening Recovery

Target Cohort:

Overdue Cardiovascular Screening

Audience:

500 synthetic patients

---

# 73. CAMPAIGN WORKFLOW

Select Cohort

→ Create Campaign

→ Preview Population

→ Choose Channel

→ Launch Demo Campaign

→ Patient statuses update

→ Simulate responses

→ Appointments scheduled

→ Campaign analytics update.

---

# 74. CAMPAIGN DETAIL

Metrics:

Targeted

Delivered

Responses

Appointments Scheduled

Completed Screenings

No Response

Opted Out

---

# 75. SIMULATE CAMPAIGN RESPONSE

Provide deterministic demo actions:

Simulate Responses

Some:

Interested

No Response

Declined

Already Completed

Then update state.

---

# 76. CARE MANAGEMENT

Create:

Care Management

Show:

Patients Under Active Management

New Referrals

Open Tasks

Follow-ups Due

High Priority

---

# 77. CARE MANAGER WORKSPACE

Show:

Assigned patients

Today's tasks

Overdue follow-ups

Recent alerts

Outreach queue

---

# 78. CARE PLAN

Patient can have:

Goals

Tasks

Monitoring

Screening

Follow-ups

Owner

Start Date

Status

---

# 79. CREATE CARE PLAN

Example:

Diabetes Follow-up Plan

Tasks:

Book review

Repeat synthetic HbA1c

Medication review

Patient education contact

---

# 80. TASK MANAGEMENT

Task:

Patient

Action

Owner

Due Date

Priority

Source

Status

---

# 81. TASK STATUS

Open

Assigned

In Progress

Completed

Overdue

Cancelled

---

# 82. AI TASK PRIORITIZATION

AI can suggest:

Today's Priority Actions

Example:

12 high-risk diabetes patients have overdue follow-up.

8 recently discharged patients have no follow-up appointment.

14 cardiovascular screening gaps are overdue by more than 60 days.

---

# 83. PREVENTIVE SCREENING

Create:

Screening

Views:

Overview

Overdue

Scheduled

Completed

---

# 84. SCREENING TYPES

Use fictional/general:

Cardiovascular Review

Diabetes Review

Blood Pressure Review

General Preventive Screening

Other

Avoid pretending to implement validated guidelines.

---

# 85. SCREENING WORKFLOW

Gap Detected

→ Outreach

→ Patient Contacted

→ Screening Scheduled

→ Completed

→ Gap Closed.

---

# 86. AI INSIGHTS PAGE

Create a polished prioritized insight feed.

Examples:

High diabetes-risk patients with overdue review

Cardiovascular screening backlog

Readmission-risk patients missing follow-up

Medication-adherence concern cohort growing

High-utilization patients without active care plan

---

# 87. INSIGHT STRUCTURE

Each insight needs:

Title

Affected Population

Evidence

Why it matters

Recommended operational action

Review Cohort

---

# 88. POPULATION TREND ANALYTICS

Create:

Population Trends

Charts:

Risk over time

Care-gap closure

Screening completion

Outreach activity

Readmission-risk cohort

High utilization

---

# 89. OUTCOME ANALYTICS

Show demo program outcomes.

Examples:

Care gaps closed

Screenings scheduled

Follow-up completed

Patients contacted

Average outreach response

Active-management completion

---

# 90. AVOID FALSE CAUSAL CLAIMS

Do NOT say:

AI reduced admissions by 32%.

Instead:

During the demo period, the number of unresolved care gaps decreased after simulated outreach activity.

---

# 91. PATIENT TIMELINE

Combine:

Lab

Encounter

Admission

Medication update

Care gap

Outreach

Screening

Care plan

Task

---

# 92. POPULATION DATA SOURCES

Create:

Data Sources

Cards:

EHR

Laboratory

Pharmacy

Appointments

Encounters

Screening

---

# 93. DATA SOURCE STATUS

Demo Connected

Simulated

Syncing

Attention Required

---

# 94. DATA FRESHNESS

Show:

Last simulated refresh

Example:

EHR

8 minutes ago

Lab

12 minutes ago

Pharmacy

22 minutes ago

---

# 95. DATA QUALITY

Create small data-quality section.

Metrics:

Complete Records

Missing Demographics

Missing Recent Encounter

Unmatched Medication Record

Stale Data

---

# 96. AI DATA QUALITY INSIGHT

Example:

1,842 patient records have incomplete recent-care information.

Population risk summaries for these patients should be reviewed cautiously.

This demonstrates responsible AI.

---

# 97. PATIENT IDENTITY

Optional:

Potential duplicate patient record

Require human review.

Do not build full HealthConnect functionality here.

---

# 98. AI SERVICE ARCHITECTURE

Do NOT scatter random logic across components.

Create:

src/services/ai/

populationRiskAI.ts

diabetesRiskAI.ts

cardiovascularRiskAI.ts

readmissionAI.ts

adherenceAI.ts

careGapAI.ts

utilizationAI.ts

cohortAI.ts

outreachPriorityAI.ts

populationInsightAI.ts

patientSummaryAI.ts

---

# 99. EXAMPLE FUNCTIONS

calculatePopulationRisk()

identifyDiabetesRisk()

identifyCardiovascularRisk()

identifyReadmissionRisk()

detectAdherenceConcern()

detectCareGaps()

identifyHighUtilization()

buildCohort()

prioritizeOutreach()

generatePopulationInsight()

generatePatientPopulationSummary()

---

# 100. DETERMINISTIC LOGIC

Do not make important outputs random.

Seed specific patient characteristics and expected outputs.

Example:

Patient A:

High Diabetes Risk

+

Overdue Review

+

Medication refill gap

should consistently appear in relevant cohorts.

---

# 101. AI EXPLAINABILITY

Every patient-level risk signal needs:

Why flagged?

Supporting evidence

Care gaps

Data source

Date

---

# 102. AI COHORT EXPLANATION

Example:

This patient belongs to:

High Diabetes Risk — Overdue Review

because:

High-risk diabetes demo flag

Follow-up overdue 42 days

No care-manager contact in 35 days.

---

# 103. HUMAN OVERSIGHT

Care manager can:

Confirm priority

Change priority

Defer outreach

Dismiss care-gap flag

Add reason.

Preserve AI suggestion.

---

# 104. CARE GAP OVERRIDE

Example:

AI:

Screening Overdue

Care Manager:

Already completed externally

Status:

Resolved — External Evidence

Audit event created.

---

# 105. AUDIT TRAIL

Columns:

Timestamp

User

Role

Patient/Cohort

Action

Previous

New

Examples:

Cohort created.

Care gap marked scheduled.

Outreach completed.

Risk priority changed.

Care plan created.

Campaign launched.

---

# 106. NOTIFICATIONS

Examples:

High-risk cohort increased.

Outreach follow-up overdue.

New readmission-risk patient.

Screening campaign response received.

Care task overdue.

---

# 107. GLOBAL SEARCH

Search:

Patient

Cohort

Condition

Care Manager

Campaign

---

# 108. UI MICROINTERACTIONS

Examples:

Cohort saved.

Outreach created.

Patient contacted.

Screening scheduled.

Care gap closed.

Campaign launched.

Task completed.

---

# 109. MODALS / DRAWERS

Use:

Cohort Builder — large drawer

Patient Risk Detail — wide drawer

Create Outreach — modal

Campaign Builder — multi-step modal/page

Care Plan — wide modal

Schedule Screening — modal

---

# 110. FILTER QUALITY

All major filters must actually work.

Do not create decorative controls.

---

# 111. TABLE QUALITY

Use:

Search

Sort

Filter

Pagination

Sticky header

Row selection

Bulk actions where appropriate.

---

# 112. BULK ACTIONS

Population-health products benefit from controlled bulk workflows.

Support:

Add to Outreach Campaign

Assign Care Manager

Create Follow-Up Queue

Export Demo List

Do not implement destructive bulk clinical actions.

---

# 113. BULK OUTREACH

Select patients

→ Add to campaign

→ Preview

→ Confirm

→ campaign membership updates.

---

# 114. PERFORMANCE

Do not render 128k rows.

Use representative patient records.

Show aggregate population metrics separately.

Pagination and virtualized table optional if needed.

---

# 115. ACCESSIBILITY

Implement:

Keyboard navigation

Focus indicators

ARIA

Focus trap

Escape behavior

Screen-reader-friendly labels

Good contrast

Non-color risk indicators

Accessible charts/tooltips

---

# 116. RESPONSIVENESS

Primary:

1440px

1280px

Tablet

This is desktop-first enterprise software.

---

# 117. ANIMATION

Use subtle:

Cohort updates

Insight loading

Metric changes

Drawer transitions

Chart transitions

Avoid:

Neon

Glowing backgrounds

Animated gradient dashboards

---

# 118. PROFESSIONAL DETAILS

Use:

Patient ID

PH-20418

Cohort ID

COH-2026-014

Campaign ID

CAM-2026-008

Care Plan

CP-2026-019

Last Contact

11 Aug 2026

Care Manager

Olivia Bennett

---

# 119. PRIMARY DEMO SCENARIO — DIABETES

Population Overview:

High Diabetes Risk
4,281

Click.

Open cohort.

Apply filter:

Follow-up Overdue

Result:

742

Open:

Maria Collins

Patient:

High Diabetes Risk

Follow-up:
42 days overdue

Medication concern:
Potential refill gap

AI explanation shown.

Create Outreach.

Assign Care Manager.

Simulate Contacted.

Schedule Diabetes Review.

Care gap:

Open
→ Scheduled

Cohort and dashboard update.

---

# 120. SECOND DEMO — CARDIOVASCULAR SCREENING

Dashboard:

6,019 overdue.

Open cohort.

Select 250 representative demo patients.

Create:

Cardiovascular Screening Recovery

campaign.

Launch demo.

Simulate responses.

Show:

Interested

Scheduled

No Response

Completed externally.

Update campaign analytics.

---

# 121. THIRD DEMO — READMISSION RISK

Open:

High Readmission Risk

1,203.

Select:

James Turner

Show:

Recent admission

No follow-up appointment

Medication review pending

AI:

High priority care-management review.

Create follow-up.

Schedule appointment.

Status updates.

---

# 122. FOURTH DEMO — HYPERTENSION

Open:

Uncontrolled Hypertension

3,842.

Select:

Robert Evans.

Show synthetic BP trend.

Review overdue.

Create care-manager task.

Simulate patient contacted.

Schedule review.

Care gap changes.

---

# 123. FIFTH DEMO — HIGH UTILIZATION

Open:

High Utilization.

Patient:

Repeated emergency encounters

No active care plan.

Create:

Active Management Plan.

Assign care manager.

Create tasks.

Patient status:

Unmanaged
→ Active Management.

---

# 124. SIXTH DEMO — COHORT BUILDER

Open:

Cohort Builder.

Select:

Condition:
Diabetes

Risk:
High

Follow-up:
Overdue

Last Contact:
>30 days

Show dynamic result.

Save:

High Diabetes Risk — Outreach Priority.

Use it in campaign.

---

# 125. PREVENT INVALID STATE

Examples:

Completed care gap should not remain in Open Gap cohort.

Completed screening should not remain overdue.

Patient cannot be simultaneously marked Unmanaged and Active Management.

Campaign cannot launch with zero patients.

Closed campaign cannot be launched again.

Completed task cannot be completed twice.

---

# 126. ROLE PERMISSIONS

Population Health Director:

View all analytics

Manage cohorts

Care Manager:

Manage assigned patients

Create outreach

Update care plans

Clinician:

Review patient context

Confirm clinical follow-up

Analyst:

View population analytics

Build non-clinical cohorts

Coordinator:

Manage screening campaigns

Administrator:

Demo configuration

---

# 127. NO AUTONOMOUS EXCLUSION

Never let AI:

remove patients from care

deny outreach

deny appointments

deprioritize protected groups

Use AI only for prioritization support.

---

# 128. FAIRNESS / RESPONSIBLE AI

Add a small:

AI Governance / Responsible Use

panel inside Settings or Risk pages.

Show:

Demo Model

Data Coverage

Human Review

Last Simulated Validation

Do not turn this into HealthGuard AI.

---

# 129. DATA FRESHNESS WARNING

If synthetic data is stale:

Display:

Some population risk signals use records older than the configured freshness threshold.

Review before action.

---

# 130. EMPTY STATES

Examples:

No patients match this cohort.

No overdue screenings.

No outreach responses.

No open care gaps.

No patients awaiting care-manager assignment.

---

# 131. ERROR STATES

Implement:

Invalid cohort rule

Missing patient record

Data source unavailable

Unable to calculate demo risk

Campaign contains no eligible patients

Patient already scheduled

Care gap already resolved

Task already completed

---

# 132. LOADING STATES

Use:

Building cohort...

Calculating population view...

Reviewing care gaps...

Generating population insight...

Loading patient history...

Keep brief.

---

# 133. DESIGN-SPECIFIC REUSABLE COMPONENTS

Create:

PopulationMetricCard

CohortCard

RiskTierBadge

CareGapBadge

PopulationInsightCard

RiskExplanationPanel

PatientCohortList

CareGapTimeline

OutreachStatus

CampaignPerformance

CohortBuilderRule

SourceEvidenceDrawer

CareManagerCard

---

# 134. SUGGESTED PROJECT STRUCTURE

Adapt to the existing project.

Conceptually:

src/
  components/
    ui/
    layout/
    population/
    cohorts/
    patients/
    risks/
    careGaps/
    outreach/
    campaigns/
    careManagement/
    analytics/
    ai/

  pages/
    PopulationOverview/
    PatientRegistry/
    PatientDetail/
    RiskStratification/
    Cohorts/
    CohortBuilder/
    CareGaps/
    HighUtilization/
    Diabetes/
    Cardiovascular/
    Hypertension/
    Readmission/
    Outreach/
    Campaigns/
    CareManagement/
    CarePlans/
    FollowUpTasks/
    Screening/
    AIInsights/
    PopulationTrends/
    OutcomeAnalytics/
    DataSources/
    Integrations/
    AuditTrail/
    Settings/

  stores/

  services/
    ai/

  data/
    seed/

  types/

  utils/

---

# 135. AUTOMATED TESTS

Add tests for:

Cohort building

Risk filtering

Care-gap detection

Care-gap status update

Outreach creation

Campaign creation

Campaign response simulation

Care-manager assignment

Care-plan creation

Task completion

Screening workflow

High-utilization cohort

Patient risk explanation

Reset demo

Role permissions

---

# 136. REGRESSION TESTS

Important:

Completed care gap leaves Open cohort.

Completed screening leaves Overdue cohort.

Patient assigned to care manager updates all relevant views.

Outreach status persists across patient and campaign pages.

Human override of AI priority persists.

Campaign counts update after patient response.

---

# 137. E2E TEST — DIABETES

Population Overview

→ High Diabetes Risk

→ Overdue Follow-up

→ Open patient

→ Create outreach

→ Contacted

→ Schedule review

→ Verify care gap

→ Verify cohort/dashboard update.

---

# 138. E2E TEST — SCREENING CAMPAIGN

Overdue cardiovascular cohort

→ Create campaign

→ Launch

→ Simulate response

→ Schedule screening

→ Verify campaign analytics

→ Verify care-gap update.

---

# 139. E2E TEST — COHORT BUILDER

Build cohort

→ Save

→ Open saved cohort

→ Add patient to outreach campaign

→ Verify counts.

---

# 140. MANUAL FINAL QA

Before completion verify:

POPULATION

Metrics coherent.

Charts meaningful.

PATIENTS

Search works.

Filters work.

Patient drill-down works.

RISK

Risk explanation works.

Sources visible.

COHORTS

Builder works.

Saved cohorts work.

Dynamic counts work.

CARE GAPS

Statuses work.

Completion removes patient from overdue/open views.

OUTREACH

Create.

Contact.

Schedule.

History updates.

CAMPAIGNS

Create.

Launch.

Response simulation.

Analytics update.

CARE MANAGEMENT

Assignment.

Care plans.

Tasks.

SCREENING

Overdue.

Schedule.

Complete.

ANALYTICS

Derived from state.

AI

No diagnoses.

Evidence visible.

SYSTEM

Simulated sources labelled.

Audit trail works.

Reset Demo works.

GENERAL

No dead buttons.

No broken routes.

No console errors.

No contradictory patient state.

No giant performance issues.

No real patient data.

No fake integration claims.

No encoding issues.

---

# 141. FINAL IMPLEMENTATION RESPONSE

After actually building the application provide:

1. Summary.
2. Files created.
3. Files modified.
4. Routes.
5. Design-system implementation.
6. State architecture.
7. Synthetic population architecture.
8. Aggregate-vs-detailed data strategy.
9. AI simulation architecture.
10. Cohort architecture.
11. Care-gap workflow.
12. Outreach architecture.
13. Campaign workflow.
14. Care-management workflow.
15. Role permissions.
16. Tests completed.
17. Known limitations.
18. Remaining TODOs.

Do not simply describe what could be implemented.

Actually implement the application.

---

# 142. FINAL PRODUCT DEMO EXPERIENCE

A healthcare executive should be able to watch this:

"This health network manages a synthetic population of 128,420 patients."

Open Population Overview.

"Rather than waiting for patients to appear in hospital, HealthPopulation AI helps identify potential risk and care gaps earlier."

Show:

High Diabetes Risk
4,281.

Open cohort.

"742 of these patients also have an overdue review."

Apply filter.

Open patient.

"The AI explains why this patient is prioritized."

Show:

Risk factors.

Care gaps.

Sources.

"It doesn't diagnose the patient. It gives the care team a prioritized view."

Click:

Create Outreach.

Assign care manager.

Simulate contact.

Schedule review.

"Now that care gap is in progress, and the patient no longer appears as untouched."

Show updated cohort.

Then:

"Here are 6,019 synthetic patients with overdue cardiovascular screening."

Open screening cohort.

Select patients.

Create campaign.

Launch.

Simulate responses.

Show:

appointments scheduled.

care gaps closing.

campaign performance.

Then:

"Here is our high-readmission-risk population."

Open patient.

Show recent admission and missing follow-up.

Create care-management plan.

Assign task.

Finally:

"Every action can be traced from population insight down to patient-level activity."

Open audit trail.

That entire story should work through one connected frontend state.

---

# 143. FINAL PRODUCT STANDARD

HealthPopulation AI should demonstrate how a modern health organization could move from:

Reactive care

to:

Proactive population management.

The application should communicate:

Risk becomes visible.

Care gaps become measurable.

Patients can be segmented intelligently.

High-priority cohorts can be identified.

Care managers know who to contact.

Screening backlogs can be organized.

Chronic disease populations can be monitored.

Outreach can be tracked.

Actions are connected to outcomes.

AI supports prioritization.

Humans remain responsible for patient care.

The final application should be polished enough to demonstrate to:

Hospital Networks

Integrated Care Systems

Health Systems

Population Health Teams

Primary Care Networks

Chronic Disease Programs

Insurance / Payer Care Management Teams

Public Health Programs

Digital Health Companies

Healthcare Software Vendors

The final product must feel:

Strategic

Premium

Data-rich

Proactive

Intelligent

Human-controlled

Highly interactive

Enterprise-ready

And visually unique within the complete healthcare AI portfolio.