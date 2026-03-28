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
       You can watch the video and answer the questions on the same page —
       pause or rewind as needed before submitting.</p>`
    : `<p>Each plan will be shown as a <strong>slideshow of still images</strong>.
       Use the arrow buttons to navigate forward and backward through the
       segments, then answer the questions on the same page.</p>`;

  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions">
        <h2>Part ${blockNum} of 3</h2>
        ${stimDesc}
        <ul>
          <li>View all 5 environments in this part.</li>
          <li>Answer three questions about each plan before moving on.</li>
          <li>After all 5 plans, complete two short questionnaires
              (about 5 minutes total).</li>
        </ul>
      </div>`,
    choices: [`Start Part ${blockNum}`],
    data: { trial_type: 'block_instructions', condition, block: blockNum },
  };
}

// ── Video + ratings trial (Condition A) ───────────────────────────────────
// Video appears in the preamble above the three Likert questions.

function makeVideoRatingTrial(condition, envNum, src) {
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <div class="trial-preamble">
        <p class="env-label">Environment ${envNum} of 5</p>
        <div class="video-container">
          <video id="stim-video" controls>
            <source src="${src}" type="video/mp4">
            <p>Your browser cannot play MP4 video.
               Please use Chrome, Firefox, or Safari.</p>
          </video>
        </div>
        <p class="stimulus-hint">Watch the animation, then answer the questions below.</p>
      </div>
      <div class="stimulus-divider"></div>`,
    questions: TRIAL_RATING_QUESTIONS,
    button_label: 'Submit',
    data: { trial_type: 'ratings', condition, env: envNum, stimulus_type: 'video' },
  };
}

// ── Carousel + ratings trial (Conditions B and C) ─────────────────────────
// Image carousel appears in the preamble above the three Likert questions.
// Carousel buttons use type="button" so they never accidentally submit the form.

function makeCarouselRatingTrial(condition, envNum, dir, nSegs) {
  // Build src list so on_load closure can reference it
  const srcs = [];
  for (let i = 1; i <= nSegs; i++) srcs.push(`${dir}/seg_${i}.png`);

  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <div class="trial-preamble">
        <p class="env-label">Environment ${envNum} of 5</p>
        <div class="carousel">
          <div class="carousel-nav">
            <button type="button" class="carousel-btn" id="seg-prev" aria-label="Previous segment">&#8249;</button>
            <span class="carousel-counter" id="seg-counter">1 / ${nSegs}</span>
            <button type="button" class="carousel-btn" id="seg-next" aria-label="Next segment">&#8250;</button>
          </div>
          <div class="carousel-viewport">
            <img id="seg-img" src="${srcs[0]}" class="segment-img"
                 alt="Segment 1 of ${nSegs}, environment ${envNum}" />
          </div>
        </div>
        <p class="stimulus-hint">Use the arrows to browse all ${nSegs} segments, then answer the questions below.</p>
      </div>
      <div class="stimulus-divider"></div>`,
    questions: TRIAL_RATING_QUESTIONS,
    button_label: 'Submit',
    on_load: function () {
      let current = 0;
      const img     = document.getElementById('seg-img');
      const counter = document.getElementById('seg-counter');
      const prevBtn = document.getElementById('seg-prev');
      const nextBtn = document.getElementById('seg-next');

      // Preload all images so navigation feels instant
      srcs.forEach((s) => { const im = new Image(); im.src = s; });

      function update() {
        img.src       = srcs[current];
        img.alt       = `Segment ${current + 1} of ${nSegs}, environment ${envNum}`;
        counter.textContent = `${current + 1} / ${nSegs}`;
        prevBtn.disabled    = current === 0;
        nextBtn.disabled    = current === nSegs - 1;
      }

      prevBtn.addEventListener('click', () => { if (current > 0)          { current--; update(); } });
      nextBtn.addEventListener('click', () => { if (current < nSegs - 1)  { current++; update(); } });

      update();
    },
    data: { trial_type: 'ratings', condition, env: envNum, stimulus_type: 'segments', seg_total: nSegs },
  };
}

// ── Post-block survey Part 1 — Plan trust (11 items, 1–5) ────────────────

function makeTiaSurvey(condition, blockNum) {
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <p><strong>Questionnaire 1 of 2</strong></p>
      <p>Please rate your agreement with the following statements about the
      <em>robot plans</em> you just reviewed.</p>`,
    questions: TIA_POST_BLOCK_QUESTIONS,
    button_label: 'Next',
    data: { trial_type: 'tia', condition, block: blockNum },
  };
}

// ── Post-block survey Part 2 — Presentation quality (10 items, 1–5) ──────

function makeScsSurvey(condition, blockNum) {
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <p><strong>Questionnaire 2 of 2</strong></p>
      <p>Please rate your agreement with the following statements about the
      <em>format the plans were presented to you</em>.</p>`,
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

    // 5 environments — stimulus and ratings are on the same page
    for (let envIdx = 0; envIdx < condData.envs.length; envIdx++) {
      const envMeta = condData.envs[envIdx];
      const envNum  = envMeta.env;

      if (condData.type === 'video') {
        timeline.push(makeVideoRatingTrial(condition, envNum, envMeta.src));
      } else {
        timeline.push(makeCarouselRatingTrial(condition, envNum, envMeta.dir, envMeta.nSegs));
      }
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
