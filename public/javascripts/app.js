import { topLevelSections } from './config/sectionConfig.js';
import { renderCard, renderFieldRow } from './components/fieldRenderer.js';
import { renderConditionSets } from './components/conditionSets.js';
import { renderMultiScorer } from './components/multiScorer.js';
import { loadAlgorithm, saveAlgorithm } from './services/algorithmApi.js';

const appRoot = document.getElementById('app');
let state = null;
let previewNode = null;

function refreshPreview() {
  if (previewNode) {
    previewNode.textContent = JSON.stringify(state, null, 2);
  }
}

function updateRootField(key, value) {
  state[key] = value;
  refreshPreview();
}

function updateMultiScorerField(key, value) {
  state.multiScorer[key] = value;
  refreshPreview();
}

function updateRanker(index, key, value) {
  state.multiScorer.rankers[index][key] = value;
  refreshPreview();
}

function updateCondition(setIndex, blockIndex, key, value) {
  state.conditionSets[setIndex].ConditionBlocks[blockIndex][key] = value;
  refreshPreview();
}

function saveStatus(message, type = 'ok') {
  const el = document.getElementById('save-status');
  if (!el) return;
  el.textContent = message;
  el.dataset.type = type;
}

function renderHeader(container) {
  const header = document.createElement('header');
  header.className = 'page-header';
  header.innerHTML = `
    <div>
      <h1>Ranking Algorithm Editor</h1>
      <p>Single-page editor split into domain components (ready for .NET Core 9 API integration).</p>
    </div>
    <div class="actions">
      <button id="reset-button" type="button">Reset from API</button>
      <button id="save-button" type="button">Save</button>
      <span id="save-status">Idle</span>
    </div>
  `;
  container.appendChild(header);

  header.querySelector('#reset-button').addEventListener('click', async () => {
    state = await loadAlgorithm();
    saveStatus('Reloaded from API/local sample');
    render();
  });

  header.querySelector('#save-button').addEventListener('click', async () => {
    const result = await saveAlgorithm(state);
    saveStatus(result.source === 'api' ? 'Saved to .NET API' : 'Saved locally (API unavailable)');
  });
}

function renderSections(container) {
  topLevelSections.forEach((section) => {
    const fields = section.fields.map((field) =>
      renderFieldRow({
        key: field,
        value: state[field],
        onChange: updateRootField,
      }),
    );
    container.appendChild(renderCard(section.title, fields));
  });
}

function renderJsonPreview(container) {
  const card = document.createElement('section');
  card.className = 'card';
  card.innerHTML = '<h2>Live JSON Preview</h2>';

  previewNode = document.createElement('pre');
  previewNode.className = 'code-block';
  refreshPreview();

  card.appendChild(previewNode);
  container.appendChild(card);
}

function render() {
  appRoot.innerHTML = '';
  renderHeader(appRoot);

  const layout = document.createElement('main');
  layout.className = 'layout-grid';
  appRoot.appendChild(layout);

  const left = document.createElement('section');
  const right = document.createElement('section');

  renderSections(left);
  renderMultiScorer(left, state, updateMultiScorerField, updateRanker);
  renderConditionSets(left, state, updateCondition);
  renderJsonPreview(right);

  layout.append(left, right);
}

async function bootstrap() {
  state = await loadAlgorithm();
  render();
}

bootstrap();
