import { renderFieldRow } from './fieldRenderer.js';

function renderCondition(condition) {
  if (!condition) {
    const empty = document.createElement('p');
    empty.className = 'muted';
    empty.textContent = 'No condition configured.';
    return empty;
  }

  const pre = document.createElement('pre');
  pre.className = 'code-block';
  pre.textContent = JSON.stringify(condition, null, 2);
  return pre;
}

export function renderConditionSets(container, state, onChange) {
  const wrapper = document.createElement('section');
  wrapper.className = 'card';

  const heading = document.createElement('h2');
  heading.textContent = 'Condition Sets';

  const info = document.createElement('p');
  info.className = 'muted';
  info.textContent = 'Per-condition overrides for MME, Summit, MultiScorer, Recency and boosts.';

  const sets = document.createElement('div');
  sets.className = 'condition-sets';

  state.conditionSets.forEach((set, setIndex) => {
    const setWrap = document.createElement('details');
    setWrap.open = setIndex < 2;

    const summary = document.createElement('summary');
    summary.textContent = `${set.SetName} (${set.ConditionBlocks.length} blocks)`;
    setWrap.appendChild(summary);

    set.ConditionBlocks.forEach((block, blockIndex) => {
      const blockCard = document.createElement('div');
      blockCard.className = 'condition-block';

      const title = document.createElement('h3');
      title.textContent = block.ConditionName ?? `Default Block ${blockIndex + 1}`;

      const controls = document.createElement('div');
      controls.className = 'card-grid';
      controls.appendChild(
        renderFieldRow({
          key: 'ConditionId',
          value: block.ConditionId,
          onChange: (key, value) => onChange(setIndex, blockIndex, key, value),
        }),
      );
      controls.appendChild(
        renderFieldRow({
          key: 'ConditionName',
          value: block.ConditionName,
          onChange: (key, value) => onChange(setIndex, blockIndex, key, value),
        }),
      );

      const sortConfig = document.createElement('pre');
      sortConfig.className = 'code-block';
      sortConfig.textContent = JSON.stringify(block.SortConfig, null, 2);

      blockCard.append(title, controls, renderCondition(block.Condition), sortConfig);
      setWrap.appendChild(blockCard);
    });

    sets.appendChild(setWrap);
  });

  wrapper.append(heading, info, sets);
  container.appendChild(wrapper);
}
