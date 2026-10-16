import { html, esc, each } from './html.mjs';

/** The first step starts selected; chapters/ai.js handles switching. */
const workflowTab = (step, index) =>
  `<button type="button" role="tab" id="step-${step.key}" aria-controls="stepDetail" aria-selected="${index === 0}" tabindex="${index === 0 ? 0 : -1}" data-step="${step.key}">${esc(step.title)}</button>`;

/** The prompt example is labeled as illustrative: nothing on the page calls an API. */
const promptWorkshop = (example) => html`
  <article class="prompt-workshop">
    <header>
      <h3>A better question.</h3>
      <small>ILLUSTRATIVE · NO API CALL</small>
    </header>
    <span class="eyebrow">THE ROUGH NOTE</span>
    <p id="promptBefore">${esc(example.before)}</p>
    <div class="refined-note">
      <span class="eyebrow">THE REFINED PROMPT</span>
      <p id="promptAfter" aria-live="polite">A little context changes everything.</p>
    </div>
    <div class="actions">
      <button class="button" id="refinePrompt" type="button">Refine it <span>✧</span></button>
      <button class="text-link" id="nextPrompt" type="button">Another note ↻</button>
    </div>
  </article>`;

/** Field notes on AI: how it is used, openly. */
export const ai = ({ copy, aiSteps, promptExamples }) => html`
  <section id="ai" class="chapter archive" data-theme="atlas" aria-labelledby="aiTitle">
    <div class="content-width">
      <header class="archive-heading">
        <span class="eyebrow">FIELD NOTES / IDEAS</span>
        <h2 id="aiTitle">Yes, I use AI.<em>and I’m good at it.</em></h2>
        <p>${esc(copy.ai.subtitle)}</p>
      </header>
      <div class="ai-layout">
        <article class="ai-story">
          <p>${esc(copy.ai.body)}</p>
          <div class="workflow" role="tablist" aria-label="My AI workflow">${each(aiSteps, workflowTab)}</div>
          <div class="step-detail" id="stepDetail" role="tabpanel" aria-labelledby="step-prompt" tabindex="0">
            <span>CONTEXT</span>
            <p>${esc(aiSteps[0].detail)}</p>
          </div>
        </article>
        ${promptWorkshop(promptExamples[0])}
      </div>
    </div>
  </section>`;
