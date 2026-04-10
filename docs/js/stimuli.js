/**
 * stimuli.js — stimulus manifest for the XG-CBS pilot study
 *
 * Paths are relative to docs/ (the GitHub Pages root).
 * Segment counts are derived from the actual files in the repository.
 *
 * Conditions:
 *   A — Full animated trajectory (MP4 video, one per environment)
 *   B — Fixed-interval segmentation (PNG images, naive baseline)
 *   C — XG-CBS optimal segmentation (PNG images, treatment)
 *
 * env_6 is a smaller tutorial environment used once per condition block.
 * Its data is tagged trial_type:'tutorial_ratings' and excluded from
 * the Qualtrics redirect URL at the end of the study.
 */

'use strict';

const STIMULI = {

  A: {
    type: 'video',
    tutorial: { env: 6, src: 'materials/figures/trajectories/env_6.mp4' },
    envs: [
      { env: 1, src: 'materials/figures/trajectories/env_1.mp4' },
      { env: 2, src: 'materials/figures/trajectories/env_2.mp4' },
      { env: 3, src: 'materials/figures/trajectories/env_3.mp4' },
      { env: 4, src: 'materials/figures/trajectories/env_4.mp4' },
      { env: 5, src: 'materials/figures/trajectories/env_5.mp4' },
    ],
  },

  B: {
    type: 'segments',
    tutorial: { env: 6, nSegs: 4, dir: 'materials/figures/random_segments/env_6' },
    envs: [
      { env: 1, nSegs: 16, dir: 'materials/figures/random_segments/env_1' },
      { env: 2, nSegs: 14, dir: 'materials/figures/random_segments/env_2' },
      { env: 3, nSegs: 10, dir: 'materials/figures/random_segments/env_3' },
      { env: 4, nSegs: 16, dir: 'materials/figures/random_segments/env_4' },
      { env: 5, nSegs: 12, dir: 'materials/figures/random_segments/env_5' },
    ],
  },

  C: {
    type: 'segments',
    tutorial: { env: 6, nSegs: 2, dir: 'materials/figures/optimal_segments/env_6' },
    envs: [
      { env: 1, nSegs: 8, dir: 'materials/figures/optimal_segments/env_1' },
      { env: 2, nSegs: 7, dir: 'materials/figures/optimal_segments/env_2' },
      { env: 3, nSegs: 5, dir: 'materials/figures/optimal_segments/env_3' },
      { env: 4, nSegs: 8, dir: 'materials/figures/optimal_segments/env_4' },
      { env: 5, nSegs: 6, dir: 'materials/figures/optimal_segments/env_5' },
    ],
  },

};

/**
 * 3-row balanced Latin square for conditions A, B, C.
 * Each condition appears exactly once in each position (1st, 2nd, 3rd)
 * across the 3 rows. With N=12, assign 4 participants per row.
 * Assignment is determined by the `order` URL parameter passed from Qualtrics.
 */
const LATIN_SQUARE = [
  ['A', 'B', 'C'],  // row 0 — order=ABC
  ['B', 'C', 'A'],  // row 1 — order=BCA
  ['C', 'A', 'B'],  // row 2 — order=CAB
];

/**
 * Parse the condition order from URL parameter.
 * Falls back to a deterministic hash of pid if the param is missing/invalid.
 *
 * @param {string|null} orderParam  e.g. "CAB" passed from Qualtrics
 * @param {string}      pid         participant ID
 * @returns {string[]}  e.g. ['C', 'A', 'B']
 */
function parseConditionOrder(orderParam, pid) {
  if (orderParam) {
    const upper = orderParam.toUpperCase();
    if (/^[ABC]{3}$/.test(upper) && new Set(upper).size === 3) {
      return upper.split('');
    }
  }
  // Deterministic fallback: hash pid into one of the 3 rows
  let hash = 0;
  for (let i = 0; i < pid.length; i++) {
    hash = (hash * 31 + pid.charCodeAt(i)) % 3;
  }
  return LATIN_SQUARE[Math.abs(hash)];
}
