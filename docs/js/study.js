/**
 * study.js — main jsPsych experiment for the XG-CBS pilot study
 *
 * Depends on (loaded before this in index.html):
 *   - jspsych core (v7)
 *   - @jspsych/plugin-html-button-response
 *   - @jspsych/plugin-survey-likert
 *   - config.js, stimuli.js, scales.js
 *
 * URL parameters expected from Qualtrics pre-study survey:
 *   ?pid=<ResponseID>&order=<ABC|ACB|BAC|BCA|CAB|CBA>
 */

'use strict';

/* ============================================================
   Bootstrap — URL params, condition order
   ============================================================ */

const urlParams = new URLSearchParams(window.location.search);
const PID   = urlParams.get('pid')   || 'test';
const ORDER = urlParams.get('order') || null;

const conditionOrder = CONFIG.TEST_MODE
  ? ['A', 'B', 'C']
  : parseConditionOrder(ORDER, PID);

/* ============================================================
   jsPsych init
   ============================================================ */

const jsPsych = initJsPsych({
  show_progress_bar: true,
  auto_update_progress_bar: true,
  on_finish: function () {
    const redirectUrl = buildRedirectUrl();
    if (CONFIG.TEST_MODE) {
      // Show JSON dump in test mode instead of redirecting
      document.body.innerHTML = `
        <div style="max-width:900px;margin:2rem auto;font-family:monospace;font-size:0.85rem;">
          <h2 style="font-family:sans-serif">Test mode — data that would be sent to Qualtrics:</h2>
          <p style="font-family:sans-serif;color:#555">Redirect URL:</p>
          <pre style="background:#f5f5f5;padding:1rem;overflow-x:auto;word-break:break-all;">${redirectUrl}</pre>
          <p style="font-family:sans-serif;color:#555">Full jsPsych data:</p>
          <pre style="background:#f5f5f5;padding:1rem;overflow-x:auto;">${JSON.stringify(jsPsych.data.get().values(), null, 2)}</pre>
        </div>`;
    } else {
      window.location.href = redirectUrl;
    }
  },
});

/* ============================================================
   Trial builders
   ============================================================ */

// ── Welcome screen ────────────────────────────────────────────────────────

function makeWelcomeTrial() {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions">
        <h2>Welcome to the XG-CBS Study</h2>
        <p>Thank you for participating. This session will take approximately
        <strong>45–60 minutes</strong>.</p>
        <p>In this study, you will view visualizations of plans made by teams
        of autonomous robots navigating through grid environments. Each robot
        is shown as a colored star and must reach its assigned goal.</p>
        <p>You will view <strong>5 different environments</strong>, each with
        a different multi-robot plan. You will do this <strong>3 times</strong>,
        with plans shown in different visualization formats.</p>
        <p>After each plan you will answer a few short questions, and after
        each set of 5 plans you will complete two brief questionnaires.</p>
        <div class="note">
          Please complete the study in one sitting without interruption, in a
          quiet environment. If you need to pause, you can use your browser's
          back button — your progress is saved within the page.
        </div>
      </div>`,
    choices: ['Begin'],
    data: { trial_type: 'welcome' },
  };
}

// ── Block instructions ────────────────────────────────────────────────────

function makeBlockInstructions(condition, blockNum) {
  const stimDesc = condition === 'A'
    ? `<p>Each plan will be shown as a <strong>continuous animation</strong>.
       Watch the full animation before proceeding — the Continue button will
       become active when the video ends.</p>`
    : `<p>Each plan will be shown as a <strong>series of still images</strong>,
       one at a time. Click through all images at your own pace before
       proceeding to the questions.</p>`;

  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions">
        <h2>Part ${blockNum} of 3</h2>
        ${stimDesc}
        <ul>
          <li>View all 5 environments in this part.</li>
          <li>After each plan, rate your comprehension on three scales.</li>
          <li>After all 5 plans, complete two short questionnaires
              (about 5 minutes total).</li>
        </ul>
      </div>`,
    choices: [`Start Part ${blockNum}`],
    data: { trial_type: 'block_instructions', condition, block: blockNum },
  };
}

// ── Environment intro ─────────────────────────────────────────────────────

function makeEnvIntro(envNum) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="env-intro">
        <div class="env-number">Environment ${envNum} of 5</div>
        <p>View the plan below, then answer three questions about it.</p>
      </div>`,
    choices: ['View plan'],
    data: { trial_type: 'env_intro', env: envNum },
  };
}

// ── Video trial (Condition A) ─────────────────────────────────────────────

function makeVideoTrial(condition, envNum, src) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="video-container">
        <p class="env-label">Environment ${envNum} of 5</p>
        <video id="stim-video" controls width="700">
          <source src="${src}" type="video/mp4">
          <p>Your browser cannot play MP4 video. Please use Chrome, Firefox,
             or Safari.</p>
        </video>
        <p class="video-hint">Watch the complete animation, then click Continue.</p>
      </div>`,
    choices: ['Continue'],
    // Disable button until video ends
    button_html: '<button class="jspsych-btn" id="video-continue-btn" disabled>%choice%</button>',
    on_load: function () {
      const video = document.getElementById('stim-video');
      const btn   = document.getElementById('video-continue-btn');
      video.addEventListener('ended', () => { btn.disabled = false; });
      // Safety: also enable if participant watches ≥ 95% of the video
      video.addEventListener('timeupdate', () => {
        if (video.duration && video.currentTime / video.duration >= 0.95) {
          btn.disabled = false;
        }
      });
    },
    data: { trial_type: 'stimulus', condition, env: envNum, stimulus_type: 'video' },
  };
}

// ── Segment image trial (Conditions B and C) ──────────────────────────────

function makeSegmentTrials(condition, envNum, dir, nSegs) {
  const trials = [];
  for (let seg = 1; seg <= nSegs; seg++) {
    const isLast = seg === nSegs;
    trials.push({
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <div class="segment-display">
          <p class="env-label">Environment ${envNum} of 5</p>
          <p class="segment-counter">Segment ${seg} of ${nSegs}</p>
          <img
            src="${dir}/seg_${seg}.png"
            class="segment-img"
            alt="Segment ${seg} of ${nSegs} — environment ${envNum}"
          >
        </div>`,
      choices: [isLast ? 'Continue to questions' : 'Next segment'],
      data: {
        trial_type: 'segment',
        condition,
        env: envNum,
        seg_index: seg,
        seg_total: nSegs,
        is_last_seg: isLast,
      },
    });
  }
  return trials;
}

// ── Per-trial ratings (3 Likert items, 1–7) ───────────────────────────────

function makeTrialRatings(condition, envNum) {
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <p><strong>Environment ${envNum} of 5 — Rate your understanding of the plan you just viewed.</strong></p>`,
    questions: TRIAL_RATING_QUESTIONS,
    button_label: 'Next',
    data: { trial_type: 'ratings', condition, env: envNum },
  };
}

// ── Post-block TiA survey (12 items, 1–5) ────────────────────────────────

function makeTiaSurvey(condition, blockNum) {
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <p><strong>Part ${blockNum} — Trust questionnaire</strong></p>
      <p>Please rate how much you agree with each statement about the
      <em>visualization format you just experienced</em>.</p>`,
    questions: TIA_POST_BLOCK_QUESTIONS,
    button_label: 'Next',
    data: { trial_type: 'tia', condition, block: blockNum },
  };
}

// ── Post-block SCS survey (10 items, 1–5) ────────────────────────────────

function makeScsSurvey(condition, blockNum) {
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <p><strong>Part ${blockNum} — Explanation quality questionnaire</strong></p>
      <p>Please rate how much you agree with each statement about the
      <em>visualization format you just experienced</em>.</p>`,
    questions: SCS_POST_BLOCK_QUESTIONS,
    button_label: 'Next',
    data: { trial_type: 'scs', condition, block: blockNum },
  };
}

// ── Between-block break ───────────────────────────────────────────────────

function makeBreakTrial(blockNum) {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions">
        <h2>Part ${blockNum - 1} complete</h2>
        <p>Great work! Take a short break if you need one.</p>
        <p>You have <strong>${4 - blockNum} part${4 - blockNum !== 1 ? 's' : ''} remaining</strong>.</p>
      </div>`,
    choices: ['Continue to Part ' + blockNum],
    data: { trial_type: 'break', before_block: blockNum },
  };
}

// ── Completion screen ─────────────────────────────────────────────────────

function makeCompletionTrial() {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions">
        <h2>Task complete</h2>
        <p>You have finished the visualization task. Click the button below
        to return to the survey for the final questions.</p>
        <div class="note">
          Do not close this tab — you will be redirected automatically when
          you click the button.
        </div>
      </div>`,
    choices: ['Submit and continue to final survey'],
    data: { trial_type: 'completion' },
  };
}

/* ============================================================
   Timeline builder
   ============================================================ */

function buildTimeline() {
  const timeline = [];

  timeline.push(makeWelcomeTrial());

  for (let blockIdx = 0; blockIdx < 3; blockIdx++) {
    const condition = conditionOrder[blockIdx];
    const blockNum  = blockIdx + 1;
    const condData  = STIMULI[condition];

    // Break screen between blocks (not before first)
    if (blockIdx > 0) {
      timeline.push(makeBreakTrial(blockNum));
    }

    timeline.push(makeBlockInstructions(condition, blockNum));

    // 5 environments
    for (let envIdx = 0; envIdx < condData.envs.length; envIdx++) {
      const envMeta = condData.envs[envIdx];
      const envNum  = envMeta.env;

      timeline.push(makeEnvIntro(envNum));

      if (condData.type === 'video') {
        timeline.push(makeVideoTrial(condition, envNum, envMeta.src));
      } else {
        // Push individual segment trials
        timeline.push(...makeSegmentTrials(condition, envNum, envMeta.dir, envMeta.nSegs));
      }

      timeline.push(makeTrialRatings(condition, envNum));
    }

    timeline.push(makeTiaSurvey(condition, blockNum));
    timeline.push(makeScsSurvey(condition, blockNum));
  }

  timeline.push(makeCompletionTrial());

  return timeline;
}

/* ============================================================
   Data encoder — builds Qualtrics redirect URL
   ============================================================ */

/**
 * Extracts Likert response values from a jsPsych survey-likert trial.
 * jsPsych stores responses as 0-based indices; we convert to 1-based.
 *
 * @param {object} trialData  single trial data object from jsPsych
 * @param {string[]} names    ordered list of question `name` attributes
 * @returns {number[]}        1-based response values
 */
function extractLikertValues(trialData, names) {
  const resp = trialData.response || {};
  return names.map((n) => (typeof resp[n] === 'number' ? resp[n] + 1 : ''));
}

function buildRedirectUrl() {
  const allData = jsPsych.data.get();
  const params  = new URLSearchParams();

  params.set('pid',   PID);
  params.set('order', conditionOrder.join(''));

  const ratingNames  = TRIAL_RATING_QUESTIONS.map((q) => q.name);
  const tiaNames     = TIA_POST_BLOCK_QUESTIONS.map((q) => q.name);
  const scsNames     = SCS_POST_BLOCK_QUESTIONS.map((q) => q.name);

  for (const cond of ['A', 'B', 'C']) {
    // Per-trial ratings
    for (let env = 1; env <= 5; env++) {
      const trial = allData.filter({ trial_type: 'ratings', condition: cond, env }).values()[0];
      if (trial) {
        params.set(`r${cond}${env}`, extractLikertValues(trial, ratingNames).join(','));
      }
    }

    // Post-block TiA
    const tiaTrial = allData.filter({ trial_type: 'tia', condition: cond }).values()[0];
    if (tiaTrial) {
      params.set(`tia${cond}`, extractLikertValues(tiaTrial, tiaNames).join(','));
    }

    // Post-block SCS
    const scsTrial = allData.filter({ trial_type: 'scs', condition: cond }).values()[0];
    if (scsTrial) {
      params.set(`scs${cond}`, extractLikertValues(scsTrial, scsNames).join(','));
    }
  }

  return `${CONFIG.QUALTRICS_POST_URL}?${params.toString()}`;
}

/* ============================================================
   Run
   ============================================================ */

jsPsych.run(buildTimeline());
