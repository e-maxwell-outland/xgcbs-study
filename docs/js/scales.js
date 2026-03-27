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
  'Neither agree nor disagree',
  'Somewhat agree',
  'Strongly agree',
];

const LIKERT_7 = ['1', '2', '3', '4', '5', '6', '7'];

const LIKERT_7_ANCHORED = [
  '1<br><small>Not at all</small>',
  '2', '3',
  '4<br><small>Moderately</small>',
  '5', '6',
  '7<br><small>Completely</small>',
];

/* ── Per-trial ratings (3 items, 1–7) ──────────────────────────────────── */

const TRIAL_RATING_QUESTIONS = [
  {
    prompt: 'I understood what the agents were doing in this plan.',
    labels: LIKERT_7_ANCHORED,
    name: 'comprehension',
    required: true,
  },
  {
    prompt: 'I felt confident in my understanding of this plan.',
    labels: LIKERT_7_ANCHORED,
    name: 'confidence',
    required: true,
  },
  {
    prompt: 'I could explain this plan to someone else.',
    labels: LIKERT_7_ANCHORED,
    name: 'explicability',
    required: true,
  },
];

/* ── TiA — post-block (12 items, 1–5) ──────────────────────────────────── */

// TODO: Verify these items against Körber (2018) and your IRB protocol.
// The items below cover the Reliability/Predictability and Familiarity
// subscales. The Propensity to Trust subscale is collected pre-study.

const TIA_POST_BLOCK_QUESTIONS = [
  {
    prompt: 'The system is capable of what it needs to do.',
    labels: LIKERT_5,
    name: 'tia_01',
    required: true,
  },
  {
    prompt: 'I can rely on the system.',
    labels: LIKERT_5,
    name: 'tia_02',
    required: true,
  },
  {
    prompt: 'The system works reliably.',
    labels: LIKERT_5,
    name: 'tia_03',
    required: true,
  },
  {
    prompt: 'I can trust the system.',
    labels: LIKERT_5,
    name: 'tia_04',
    required: true,
  },
  {
    prompt: 'I am confident in the system.',
    labels: LIKERT_5,
    name: 'tia_05',
    required: true,
  },
  {
    prompt: 'I know what the system will do next.',
    labels: LIKERT_5,
    name: 'tia_06',
    required: true,
  },
  {
    prompt: 'The system behaves consistently.',
    labels: LIKERT_5,
    name: 'tia_07',
    required: true,
  },
  {
    prompt: 'The system responds in ways I would expect.',
    labels: LIKERT_5,
    name: 'tia_08',
    required: true,
  },
  {
    prompt: 'I am familiar with how this type of system works.',
    labels: LIKERT_5,
    name: 'tia_09',
    required: true,
  },
  {
    prompt: 'The system is well-suited for this task.',
    labels: LIKERT_5,
    name: 'tia_10',
    required: true,
  },
  {
    prompt: "The system's design allows me to trust it.",
    labels: LIKERT_5,
    name: 'tia_11',
    required: true,
  },
  {
    prompt: 'The system is able to handle all the situations it encounters.',
    labels: LIKERT_5,
    name: 'tia_12',
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

/* ── SCS — post-block (10 items, 1–5) ──────────────────────────────────── */

// TODO: Verify these items against Holzinger et al. (2020) and your protocol.
// Items are adapted for a path-planning / multi-agent context.

const SCS_POST_BLOCK_QUESTIONS = [
  {
    prompt: 'I was able to understand the content of the explanation.',
    labels: LIKERT_5,
    name: 'scs_01',
    required: true,
  },
  {
    prompt: 'It is easy to understand why the agents moved as they did.',
    labels: LIKERT_5,
    name: 'scs_02',
    required: true,
  },
  {
    prompt: "The explanation allows me to judge the reliability of the system's decisions.",
    labels: LIKERT_5,
    name: 'scs_03',
    required: true,
  },
  {
    prompt: "I can understand what caused the outcome of the system's plan.",
    labels: LIKERT_5,
    name: 'scs_04',
    required: true,
  },
  {
    prompt: "The explanation helps me understand how the agents' actions connect to the goal.",
    labels: LIKERT_5,
    name: 'scs_05',
    required: true,
  },
  {
    prompt: 'The system provides the right level of detail in its explanation.',
    labels: LIKERT_5,
    name: 'scs_06',
    required: true,
  },
  {
    prompt: 'The explanation was clearly presented.',
    labels: LIKERT_5,
    name: 'scs_07',
    required: true,
  },
  {
    prompt: 'The explanation helps me make my own judgments about the plan.',
    labels: LIKERT_5,
    name: 'scs_08',
    required: true,
  },
  {
    prompt: 'All necessary information was provided in the explanation.',
    labels: LIKERT_5,
    name: 'scs_09',
    required: true,
  },
  {
    prompt: 'I could explain to someone else why the agents moved as they did.',
    labels: LIKERT_5,
    name: 'scs_10',
    required: true,
  },
];
