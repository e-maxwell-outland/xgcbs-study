/**
 * scales.js — validated scale items for the XG-CBS pilot study
 *
 * Sources:
 *   TiA     — Körber (2019). Theoretical considerations and development of a
 *              questionnaire to measure trust in automation. IEA 2018 Congress.
 *   SCS     — Holzinger et al. (2020). Measuring the quality of explanations:
 *              the system causability scale (SCS). KI - Künstliche Intelligenz.
 *   TLX     — Hart & Staveland (1988). Development of NASA-TLX. Advances in
 *              Psychology, 52, 139–183. Raw (unweighted) version per Hart (2006).
 *   RSME    — Zijlstra (1993). Single-item effort measure; used for trial_04.
 */

'use strict';

/* ── Shared label sets ──────────────────────────────────────────────────── */

// Standard agreement scale (used for trial_01–03, TiA, SCS)
const LIKERT_5 = [
  'Strongly disagree',
  'Somewhat disagree',
  'Neither agree<br>nor<br>disagree',
  'Somewhat agree',
  'Strongly agree',
];

// Low → High scale (used for trial_04 workload and NASA-TLX items)
const LIKERT_5_LOW_HIGH = [
  '1<br><small>Very low</small>',
  '2',
  '3',
  '4',
  '5<br><small>Very high</small>',
];

// Performance scale for tlx_02 (reversed: Perfect → Failure)
const LIKERT_5_PERFORMANCE = [
  '1<br><small>Perfect</small>',
  '2',
  '3',
  '4',
  '5<br><small>Failure</small>',
];

/* ── Per-trial ratings (4 items, 1–5) ──────────────────────────────────── */
// trial_01–03: 5-point Likert (1 = Strongly Disagree → 5 = Strongly Agree)
// trial_04: 5-point effort scale (1 = Very Low → 5 = Very High)

const TRIAL_RATING_QUESTIONS = [
  {
    prompt: 'I personally understand why this plan is collision-free.',
    labels: LIKERT_5,
    name: 'comprehension',
    required: true,
  },
  {
    prompt: 'I am confident in approving this plan for execution.',
    labels: LIKERT_5,
    name: 'confidence',
    required: true,
  },
  {
    prompt: 'I am that I could explain this plan to someone else.',
    labels: LIKERT_5,
    name: 'explicability',
    required: true,
  },
  {
    prompt: 'How much mental effort did you exert to understand this plan?',
    labels: LIKERT_5_LOW_HIGH,
    name: 'workload',
    required: true,
  },
];

/* ── TiA — Trust in Automation (post-block, 9 items, 1–5) ──────────────── */
// Körber (2019), abbreviated version of 3 subscales.
// Driving-system referents replaced with plan-verification referents.
// Dropped: pt_06 (overlap with trial_01 and SCS pq_02),
//          pt_09 (near-duplicate of pt_04 and pq_09).
// Instructions: "Please rate your agreement with the following statements
//               about the robot plans you just reviewed."

const TIA_POST_BLOCK_QUESTIONS = [
  // Subscale: Reliability / Competence
  {
    prompt: 'The plans were reliable.',
    labels: LIKERT_5,
    name: 'pt_01',
    required: true,
  },
  {
    prompt: 'The plans achieved their intended goal dependably.',
    labels: LIKERT_5,
    name: 'pt_02',
    required: true,
  },
  {
    prompt: 'The plans can handle the situations correctly.',
    labels: LIKERT_5,
    name: 'pt_03',
    required: true,
  },
  {
    prompt: "I am confident in the plans' ability to avoid collisions.",
    labels: LIKERT_5,
    name: 'pt_04',
    required: true,
  },
  // Subscale: Predictability / Understandability
  {
    prompt: 'The plans behaved as I would expect.',
    labels: LIKERT_5,
    name: 'pt_05',
    required: true,
  },
  {
    prompt: "The plans predictably represented the agents' goals.",
    labels: LIKERT_5,
    name: 'pt_07',
    required: true,
  },
  // Subscale: Faith / Trust
  {
    prompt: 'I trust the plans.',
    labels: LIKERT_5,
    name: 'pt_08',
    required: true,
  },
  {
    prompt: 'I would feel comfortable approving these plans for execution.',
    labels: LIKERT_5,
    name: 'pt_10',
    required: true,
  },
  {
    prompt: 'I would be willing to act on these plans without additional verification.',
    labels: LIKERT_5,
    name: 'pt_11',
    required: true,
  },
];

/* ── SCS — Presentation Quality (post-block, 8 items, 1–5) ─────────────── */
// Holzinger et al. (2020), abbreviated from 10 items.
// Clinical referents replaced with plan-verification referents.
// Dropped: pq_01 (overlap with pq_02 and trial_01),
//          pq_10 (near-duplicate of pq_04 and TiA pt_10/pt_11).
// NOTE: pq_07 is REVERSE-SCORED (recode 1↔5, 2↔4 before computing SCS total).
// Instructions: "Please rate your agreement with the following statements
//               about the way the plans were presented to you."

const SCS_POST_BLOCK_QUESTIONS = [
  {
    prompt: "I could follow the agents' movements step by step using this presentation style.",
    labels: LIKERT_5,
    name: 'pq_02',
    required: true,
  },
  {
    prompt: 'I would be able to explain to someone else why these plans did not result in a collision.',
    labels: LIKERT_5,
    name: 'pq_03',
    required: true,
  },
  {
    prompt: 'This presentation style gave me the information I needed to approve or reject the plan.',
    labels: LIKERT_5,
    name: 'pq_04',
    required: true,
  },
  {
    prompt: 'I could identify which parts of the plan were most relevant to verifying safety.',
    labels: LIKERT_5,
    name: 'pq_05',
    required: true,
  },
  {
    prompt: 'The presentation matched the way I naturally think about agent movement.',
    labels: LIKERT_5,
    name: 'pq_06',
    required: true,
  },
  {
    prompt: 'I need to seek additional information beyond the presentation to feel confident.',
    labels: LIKERT_5,
    name: 'pq_07',   // REVERSE-SCORED
    required: true,
  },
  {
    prompt: "This presentation style helped me understand the cause of the agents' spatial arrangement, not just the outcome.",
    labels: LIKERT_5,
    name: 'pq_08',
    required: true,
  },
  {
    prompt: 'I was able to verify that the agents do not collide using the presentation.',
    labels: LIKERT_5,
    name: 'pq_09',
    required: true,
  },
];

/* ── NASA-TLX (post-block, 4 items, 1–5) ───────────────────────────────── */
// Hart & Staveland (1988). Raw NASA-TLX without weighting procedure (Hart, 2006).
// Physical Demand and Temporal Demand subscales omitted (see study documentation).
// NOTE: tlx_02 (Performance) is REVERSE-SCORED relative to the other subscales —
//       lower ratings indicate better performance. Recode (1↔5, 2↔4) before
//       computing a composite workload score.
// Instructions: "Please rate the following aspects of your experience reviewing
//               the plans in this block."

const NASA_TLX_QUESTIONS = [
  {
    prompt: 'How much mental and perceptual activity was required to understand the plans?',
    labels: LIKERT_5_LOW_HIGH,
    name: 'tlx_01',   // Mental Demand
    required: true,
  },
  {
    prompt: 'How successful were you in understanding the plans?',
    labels: LIKERT_5_PERFORMANCE,
    name: 'tlx_02',   // Performance — REVERSE-SCORED
    required: true,
  },
  {
    prompt: 'How hard did you have to work to understand the plans?',
    labels: LIKERT_5_LOW_HIGH,
    name: 'tlx_03',   // Effort
    required: true,
  },
  {
    prompt: 'How insecure, discouraged, irritated, or annoyed were you?',
    labels: LIKERT_5_LOW_HIGH,
    name: 'tlx_04',   // Frustration
    required: true,
  },
];

/* ── TiA Propensity to Trust — pre-study (collected in Qualtrics) ──────── */
// NOTE: Collected in Qualtrics pre-study, NOT in jsPsych. Included for reference.
//
// const TIA_PROPENSITY_QUESTIONS = [
//   'In general, I trust automated systems.',
//   'Automated systems are usually reliable.',
//   'I tend to trust machines more than humans for routine tasks.',
//   'I believe automated systems perform tasks efficiently.',
// ];
