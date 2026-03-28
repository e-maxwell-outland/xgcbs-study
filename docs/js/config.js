/**
 * config.js — study configuration
 *
 * BEFORE GOING LIVE, set:
 *   1. QUALTRICS_POST_URL   → the URL of your Qualtrics post-study survey
 *   2. QUALTRICS_SETUP notes below → how to configure the Qualtrics surveys
 *
 * ==========================================================================
 * QUALTRICS SETUP GUIDE
 * ==========================================================================
 *
 * ── Pre-study survey (Survey 1) ───────────────────────────────────────────
 * Survey flow:
 *   1. Add Embedded Data at the start of the flow:
 *        pid      = ${e://Field/ResponseID}
 *        condition_order = (set via Randomizer — see below)
 *   2. Add a Randomizer block with 6 branches (one per Latin square row):
 *        Row 0 → condition_order = ABC
 *        Row 1 → condition_order = ACB
 *        Row 2 → condition_order = BAC
 *        Row 3 → condition_order = BCA
 *        Row 4 → condition_order = CAB
 *        Row 5 → condition_order = CBA
 *      Set the Randomizer to present exactly 1 branch per participant.
 *   3. Add your survey blocks (consent, demographics, TiA propensity).
 *   4. End-of-Survey Options → Redirect to URL:
 *        https://YOUR-GITHUB-USERNAME.github.io/xgcbs-study/?pid=${e://Field/pid}&order=${e://Field/condition_order}
 *      (Replace with your actual GitHub Pages URL once enabled.)
 *
 * ── Post-study survey (Survey 2) ──────────────────────────────────────────
 * Survey flow:
 *   1. Add Embedded Data at the start of the flow to capture all URL params.
 *      Create fields named exactly as listed in EMBEDDED_DATA_FIELDS below.
 *      Set each to "Set value from panel or URL" (leave value blank).
 *   2. Add your survey blocks (forced-choice preference, open-text feedback,
 *      debrief).
 *   3. Copy the survey's "Anonymous Link" and paste it as QUALTRICS_POST_URL.
 *
 * EMBEDDED_DATA_FIELDS to create in Survey 2:
 *   pid, order,
 *   rA1, rA2, rA3, rA4, rA5,   (per-trial ratings: condition A, envs 1–5)
 *   rB1, rB2, rB3, rB4, rB5,
 *   rC1, rC2, rC3, rC4, rC5,
 *   tiaA, tiaB, tiaC,           (post-block TiA, 9 items, comma-separated)
 *   scsA, scsB, scsC,           (post-block SCS, 8 items, comma-separated)
 *   tlxA, tlxB, tlxC            (post-block NASA-TLX, 4 items, comma-separated)
 *
 * Each rating field (e.g. rA1) contains four comma-separated values:
 *   comprehension,confidence,explicability,workload  (each 1–5)
 * Each tia/scs/tlx field contains comma-separated item responses (1–5).
 * Item order within each field matches the order in scales.js.
 * ==========================================================================
 */

'use strict';

const CONFIG = {
  /**
   * Full URL of the Qualtrics post-study survey (anonymous link).
   * Participant data is appended as URL query parameters.
   *
   * Example:
   *   'https://youruni.qualtrics.com/jfe/form/SV_XXXXXXXXX'
   */
  QUALTRICS_POST_URL: 'YOUR_QUALTRICS_POST_STUDY_SURVEY_URL_HERE',

  /**
   * Set to true during development/testing.
   * When true: uses order ABC regardless of URL params, and instead of
   * redirecting to Qualtrics at the end, shows a JSON data dump.
   */
  TEST_MODE: true,
};
