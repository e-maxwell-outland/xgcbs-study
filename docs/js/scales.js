/**
 * scales.js — validated scale items for the XG-CBS pilot study
 *
 * !! TODO: Verify all items against your exact protocol before running. !!
 *
 * Sources:
 *   TiA  — Körber (2018). Theoretical considerations and development of a
 *           questionnaire to measure trust in automation. IEA 2018.
 *   SCS  — Holzinger et al. (2020). Measuring the quality of explanations:
 *           the system causability scale (SCS). KI - Künstliche Intelligenz.
 */

'use strict';

/* ── Shared label sets ──────────────────────────────────────────────────── */

const LIKERT_5 = [
  'Strongly disagree',
  'Somewhat disagree',
  'Neither agree<br>nor<br>disagree',
  'Somewhat agree',
  'Strongly agree',
];

const LIKERT_5_HOW = [
  '1<br><small>Not at all</small>',
  '2',
  '3<br><small>Moderately</small>',
  '4',
  '5<br><small>Completely</small>',
];

/* ── Per-trial ratings (3 items, 1–7) ──────────────────────────────────── */

const TRIAL_RATING_QUESTIONS = [
  {
    prompt: 'How well do you personally understand why this plan is collision-free?',
    labels: LIKERT_5_HOW,
    name: 'comprehension',
    required: true,
  },
  {
    prompt: 'How confident are you in approving this plan for execution?',
    labels: LIKERT_5_HOW,
    name: 'confidence',
    required: true,
  },
  {
    prompt: 'How confident are you that you could explain this plan to someone else?',
    labels: LIKERT_5_HOW,
    name: 'explicability',
    required: true,
  },
];

/* ── Plan trust — post-block Part 1 (11 items, 1–5) ────────────────────── */
// Evaluates trust and reliability in the plans themselves (not the presentation).

const TIA_POST_BLOCK_QUESTIONS = [
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
  {
    prompt: 'The plans behaved as I would expect.',
    labels: LIKERT_5,
    name: 'pt_05',
    required: true,
  },
  {
    prompt: 'I was able to understand why the agents moved the way they did.',
    labels: LIKERT_5,
    name: 'pt_06',
    required: true,
  },
  {
    prompt: "The plans predictably represented the agents' goals.",
    labels: LIKERT_5,
    name: 'pt_07',
    required: true,
  },
  {
    prompt: 'I trust the plans.',
    labels: LIKERT_5,
    name: 'pt_08',
    required: true,
  },
  {
    prompt: 'I can rely on the plans to keep agents from colliding.',
    labels: LIKERT_5,
    name: 'pt_09',
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

/* ── TiA Propensity to Trust — pre-study (4 items, 1–5) ────────────────── */

// NOTE: These are collected in Qualtrics pre-study, NOT in jsPsych.
// Included here for reference only.
//
// const TIA_PROPENSITY_QUESTIONS = [
//   'In general, I trust automated systems.',
//   'Automated systems are usually reliable.',
//   'I tend to trust machines more than humans for routine tasks.',
//   'I believe automated systems perform tasks efficiently.',
// ];

/* ── Presentation quality — post-block Part 2 (10 items, 1–5) ──────────── */
// Evaluates how well the visualization format supported understanding.

const SCS_POST_BLOCK_QUESTIONS = [
  {
    prompt: "The presentation allowed me to understand the agents' paths clearly.",
    labels: LIKERT_5,
    name: 'pq_01',
    required: true,
  },
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
    name: 'pq_07',
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
  {
    prompt: 'The quality of the presentation was sufficient for making a decision about plan execution.',
    labels: LIKERT_5,
    name: 'pq_10',
    required: true,
  },
];
