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
    } else if (CONFIG.SHOW_REDIRECT_DEBUG) {
      // Show redirect URL for inspection before proceeding — useful for
      // diagnosing Qualtrics embedded-data capture issues.
      document.body.innerHTML = `
        <div style="max-width:860px;margin:3rem auto;font-family:sans-serif;padding:0 1rem;">
          <h2>Debug — redirect URL</h2>
          <p style="color:#555;font-size:0.9rem;">
            Copy this URL and open it in a new tab to verify Qualtrics receives
            the parameters. Check that all embedded-data fields are populated in
            the Qualtrics response before turning off SHOW_REDIRECT_DEBUG.
          </p>
          <pre style="background:#f5f5f5;padding:1rem;font-size:0.75rem;overflow-x:auto;
                      word-break:break-all;border:1px solid #ddd;border-radius:4px;">${redirectUrl}</pre>
          <button onclick="window.location.href='${redirectUrl.replace(/'/g, "\\'")}'"
                  style="margin-top:1.5rem;padding:0.75rem 2rem;font-size:1rem;
                         background:#1a73e8;color:#fff;border:none;border-radius:4px;cursor:pointer;">
            Proceed to Qualtrics survey →
          </button>
        </div>`;
    } else {
      window.location.href = redirectUrl;
    }
  },
});

/* ============================================================
   Trial builders
   ============================================================ */

// Returns questions with required:false when SKIP_REQUIRED is enabled.
function q(questions) {
  return CONFIG.SKIP_REQUIRED
    ? questions.map((qs) => ({ ...qs, required: false }))
    : questions;
}

// ── Welcome screen ────────────────────────────────────────────────────────

function makeWelcomeTrial() {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions">
        <h2>Welcome to the XG-CBS Study</h2>
        <p>Thank you for participating. This session will take approximately
        <strong>45–60 minutes</strong>.</p>
        <p>You will view visualizations of robot navigation plans and answer
        a few questions about each one. You will see plans presented in
        <strong>3 different formats</strong>, each covering
        <strong>5 warehouse environments</strong>.</p>
        <p>After each set of 5 plans you will complete three brief
        questionnaires (about 5–7 minutes total).</p>
        <div class="note">
          Please complete the study in one sitting without interruption, in a
          quiet environment. You may use a desktop, laptop, or mobile device.
        </div>
      </div>`,
    choices: ['Continue'],
    data: { trial_type: 'welcome' },
  };
}

// ── Scenario framing ──────────────────────────────────────────────────────

function makeScenarioTrial() {
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions scenario">
        <h2>Your role</h2>
        <p>Imagine you are a <strong>warehouse supervisor</strong>. Your
        facility uses a team of autonomous robots to move goods from one
        part of the warehouse to another.</p>
        <p>Before each shift, the robots generate a coordinated movement
        plan and ask you to <strong>review and approve it</strong> before
        they execute it.</p>
        <p>Every plan you will see in this study is
        <strong>collision-free</strong> — no two robots will ever occupy
        the same location at the same time. Your job is not to find
        collisions, but to <strong>understand why the plan is safe</strong>
        well enough that you could approve it with confidence and explain
        it to a colleague if needed.</p>
        <div class="note">
          Think of yourself as the human-in-the-loop: the system has done
          the work, and you are providing the final sign-off.
        </div>
      </div>`,
    choices: ['I understand — show me the study'],
    data: { trial_type: 'scenario' },
  };
}

// ── Block instructions ────────────────────────────────────────────────────

function makeBlockInstructions(condition, blockNum, blockLabel) {
  const stimDesc = condition === 'A'
    ? `<p>In this part, each plan will be shown as a
       <strong>continuous animation</strong>. You can watch the video and
       answer the questions on the same page — pause or rewind as
       needed before submitting.</p>`
    : `<p>In this part, each plan will be shown as a
       <strong>slideshow of still images</strong>. Use the arrow buttons
       to navigate forward and backward through the segments, then answer
       the questions on the same page.</p>`;

  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions">
        <h2>Presentation ${blockLabel}</h2>
        ${stimDesc}
        <ul>
          <li>Before the real environments start, you will complete a
              short <strong>tutorial</strong> with a practice environment.</li>
          <li>Then view <strong>5 warehouse environments</strong>, answering
              three questions about each plan.</li>
          <li>After all 5 plans, complete three short questionnaires.</li>
        </ul>
      </div>`,
    choices: [`Start Presentation ${blockLabel}`],
    data: { trial_type: 'block_instructions', condition, block: blockNum },
  };
}

// ── Tutorial instructions (condition-specific) ────────────────────────────

function makeTutorialInstructions(condition, blockLabel) {
  // Shared legend callout used by all conditions
  const legendNote = `
    <div class="tutorial-callout">
      <strong>Reading the visualization:</strong>
      <ul>
        <li>Each <strong>colored circle ●</strong> is a robot at its
            current (start) position.</li>
        <li>Each <strong>colored star ★</strong> of the same color is
            that robot's goal — where it needs to reach.</li>
        <li>The grid cells shown in black are obstacles (walls).</li>
      </ul>
    </div>`;

  const collisionNote = `
    <div class="tutorial-callout tutorial-callout--warning">
      <strong>Important — what collision-free means:</strong>
      <p>No two robots will ever be in the same grid cell at the same
      time step. Remember: you are not looking for collisions (there are
      none) — you are trying to <em>understand why</em> the plan is safe.</p>
    </div>`;

  let formatNote;
  if (condition === 'A') {
    formatNote = `
      <div class="tutorial-callout">
        <strong>Using the animation:</strong>
        <ul>
          <li>Press <strong>▶ Play</strong> to watch all robots move
              simultaneously to their goals.</li>
          <li>Use the video controls to <strong>pause or rewind</strong>
              at any point.</li>
          <li>You do not need to watch the full video before answering —
              pause and reflect whenever you're ready.</li>
        </ul>
      </div>`;
  } else {
    const arrowNote = `
      <div class="tutorial-callout tutorial-callout--arrow">
        <strong>What the arrows mean:</strong>
        <p>Each arrow on a robot shows the <strong>direction it moved</strong>
        during that time segment — from where it started the segment to
        where it ended up.</p>
        <p>⚠️ When arrows from different robots <strong>overlap or
        cross</strong>, this does <em>not</em> mean they collide.
        The robots passed through overlapping areas of the grid at
        <strong>different times</strong>. The plan is still
        collision-free — use the segments together to understand
        the full picture.</p>
      </div>`;

    formatNote = `
      ${arrowNote}
      <div class="tutorial-callout">
        <strong>Navigating the slideshow:</strong>
        <ul>
          <li>Use the <strong>‹ ›</strong> arrow buttons to move between
              segments at your own pace.</li>
          <li>You can go <strong>forwards and backwards</strong> freely
              before answering.</li>
          <li>Each segment covers a portion of the robots' journey —
              together they show the full plan.</li>
        </ul>
      </div>`;
  }

  const questionsNote = `
    <div class="tutorial-callout">
      <strong>The statements you'll evaluate after each plan:</strong>
      <ol>
        <li><em>I personally understand why this plan is collision-free.</em> — your own comprehension of the plan's
            safety logic.</li>
        <li><em>I am confident in approving this plan for execution.</em> — whether you'd sign off on it as supervisor.</li>
        <li><em>I am confident that I could explain this plan to someone else.</em> — whether you understand it well
            enough to communicate it.</li>
        <li><em>How much mental effort did you exert to understand this plan?</em> — your perceived cognitive effort.</li>
      </ol>
    </div>`;

  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions">
        <h2>Presentation ${blockLabel} — Tutorial</h2>
        <p>Before the real environments begin, work through this practice
        environment to get familiar with the format. Your answers here
        <strong>will not</strong> be included in the study data.</p>
        ${legendNote}
        ${collisionNote}
        ${formatNote}
        ${questionsNote}
      </div>`,
    choices: ['Start tutorial'],
    data: { trial_type: 'tutorial_instructions', condition },
  };
}

// ── Video + ratings trial (Condition A) ───────────────────────────────────
// Video appears in the preamble above the three Likert questions.
// isTutorial=true tags the data so it is excluded from the Qualtrics upload.

function makeVideoRatingTrial(condition, envNum, src, isTutorial = false) {
  const label = isTutorial ? 'Tutorial environment' : `Environment ${envNum} of 5`;
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <div class="trial-preamble">
        <p class="env-label">${label}</p>
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
    questions: q(TRIAL_RATING_QUESTIONS),
    button_label: isTutorial ? 'Submit (practice)' : 'Submit',
    data: {
      trial_type: isTutorial ? 'tutorial_ratings' : 'ratings',
      condition,
      env: envNum,
      stimulus_type: 'video',
    },
  };
}

// ── Carousel + ratings trial (Conditions B and C) ─────────────────────────
// Image carousel appears in the preamble above the three Likert questions.
// Carousel buttons use type="button" so they never accidentally submit the form.

function makeCarouselRatingTrial(condition, envNum, dir, nSegs, isTutorial = false) {
  // Build src list so on_load closure can reference it
  const srcs = [];
  for (let i = 1; i <= nSegs; i++) srcs.push(`${dir}/seg_${i}.png`);

  const label = isTutorial ? 'Tutorial environment' : `Environment ${envNum} of 5`;

  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <div class="trial-preamble">
        <p class="env-label">${label}</p>
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
    questions: q(TRIAL_RATING_QUESTIONS),
    button_label: isTutorial ? 'Submit (practice)' : 'Submit',
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
    data: {
      trial_type: isTutorial ? 'tutorial_ratings' : 'ratings',
      condition,
      env: envNum,
      stimulus_type: 'segments',
      seg_total: nSegs,
    },
  };
}

// ── Post-block survey Part 1 — Plan trust (11 items, 1–5) ────────────────

function makeTiaSurvey(condition, blockNum, blockLabel) {
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <p><strong>Presentation ${blockLabel} — Questionnaire 1 of 3</strong></p>
      <p>Please rate your agreement with the following statements about the
      <em>robot plans</em> you just reviewed.</p>`,
    questions: q(TIA_POST_BLOCK_QUESTIONS),
    button_label: 'Next',
    data: { trial_type: 'tia', condition, block: blockNum },
  };
}

// ── Post-block survey Part 2 — Presentation quality (8 items, 1–5) ───────

function makeScsSurvey(condition, blockNum, blockLabel) {
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <p><strong>Presentation ${blockLabel} — Questionnaire 2 of 3</strong></p>
      <p>Please rate your agreement with the following statements about the
      <em>format the plans were presented to you</em>.</p>`,
    questions: q(SCS_POST_BLOCK_QUESTIONS),
    button_label: 'Next',
    data: { trial_type: 'scs', condition, block: blockNum },
  };
}

// ── Post-block survey Part 3 — Workload / NASA-TLX (4 items, 1–5) ────────

function makeNasaTlxSurvey(condition, blockNum, blockLabel) {
  return {
    type: jsPsychSurveyLikert,
    preamble: `
      <p><strong>Presentation ${blockLabel} — Questionnaire 3 of 3</strong></p>
      <p>Please rate the following aspects of your experience reviewing the
      plans in this block.</p>`,
    questions: q(NASA_TLX_QUESTIONS),
    button_label: 'Next',
    data: { trial_type: 'tlx', condition, block: blockNum },
  };
}

// ── Between-block break ───────────────────────────────────────────────────

function makeBreakTrial(blockNum, prevLabel, nextLabel) {
  const remaining = 4 - blockNum;
  return {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
      <div class="instructions">
        <h2>Presentation ${prevLabel} complete</h2>
        <p>Great work! Take a short break if you need one.</p>
        <p>You have <strong>${remaining} presentation${remaining !== 1 ? 's' : ''} remaining</strong>.</p>
      </div>`,
    choices: [`Continue to Presentation ${nextLabel}`],
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

  // Opening screens
  timeline.push(makeWelcomeTrial());
  timeline.push(makeScenarioTrial());

  const LABELS = ['A', 'B', 'C'];

  for (let blockIdx = 0; blockIdx < 3; blockIdx++) {
    const condition  = conditionOrder[blockIdx];
    const blockNum   = blockIdx + 1;
    const blockLabel = LABELS[blockIdx];   // participant-facing label (always A→B→C)
    const condData   = STIMULI[condition];

    // Break screen between blocks (not before first)
    if (blockIdx > 0) {
      timeline.push(makeBreakTrial(blockNum, LABELS[blockIdx - 1], blockLabel));
    }

    timeline.push(makeBlockInstructions(condition, blockNum, blockLabel));

    // Tutorial (env_6 — practice, data excluded from Qualtrics upload)
    timeline.push(makeTutorialInstructions(condition, blockLabel));
    const tut = condData.tutorial;
    if (condData.type === 'video') {
      timeline.push(makeVideoRatingTrial(condition, tut.env, tut.src, /* isTutorial */ true));
    } else {
      timeline.push(makeCarouselRatingTrial(condition, tut.env, tut.dir, tut.nSegs, /* isTutorial */ true));
    }

    // 5 real environments — stimulus and ratings on the same page
    for (let envIdx = 0; envIdx < condData.envs.length; envIdx++) {
      const envMeta = condData.envs[envIdx];
      if (condData.type === 'video') {
        timeline.push(makeVideoRatingTrial(condition, envMeta.env, envMeta.src));
      } else {
        timeline.push(makeCarouselRatingTrial(condition, envMeta.env, envMeta.dir, envMeta.nSegs));
      }
    }

    timeline.push(makeTiaSurvey(condition, blockNum, blockLabel));
    timeline.push(makeScsSurvey(condition, blockNum, blockLabel));
    timeline.push(makeNasaTlxSurvey(condition, blockNum, blockLabel));
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
  const tlxNames     = NASA_TLX_QUESTIONS.map((q) => q.name);

  for (const cond of ['A', 'B', 'C']) {
    // Per-trial ratings (4 values: comprehension, confidence, explicability, workload)
    for (let env = 1; env <= 5; env++) {
      const trial = allData.filter({ trial_type: 'ratings', condition: cond, env }).values()[0];
      if (trial) {
        params.set(`r${cond}${env}`, extractLikertValues(trial, ratingNames).join(','));
      }
    }

    // Post-block TiA (9 items)
    const tiaTrial = allData.filter({ trial_type: 'tia', condition: cond }).values()[0];
    if (tiaTrial) {
      params.set(`tia${cond}`, extractLikertValues(tiaTrial, tiaNames).join(','));
    }

    // Post-block SCS (8 items)
    const scsTrial = allData.filter({ trial_type: 'scs', condition: cond }).values()[0];
    if (scsTrial) {
      params.set(`scs${cond}`, extractLikertValues(scsTrial, scsNames).join(','));
    }

    // Post-block NASA-TLX (4 items)
    const tlxTrial = allData.filter({ trial_type: 'tlx', condition: cond }).values()[0];
    if (tlxTrial) {
      params.set(`tlx${cond}`, extractLikertValues(tlxTrial, tlxNames).join(','));
    }
  }

  return `${CONFIG.QUALTRICS_POST_URL}?${params.toString()}`;
}

/* ============================================================
   Run
   ============================================================ */

jsPsych.run(buildTimeline());
