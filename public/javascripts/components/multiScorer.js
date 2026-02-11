import { renderFieldRow } from './fieldRenderer.js';

export function renderMultiScorer(container, state, onRootChange, onRankerChange) {
  const card = document.createElement('section');
  card.className = 'card';

  const heading = document.createElement('h2');
  heading.textContent = 'Multi Scorer';

  const grid = document.createElement('div');
  grid.className = 'card-grid';

  ['populateStrategyName', 'slottedFallbackGridId', 'slottedFallbackGridName', 'slottedFallbackGridDistributionName'].forEach(
    (field) => {
      grid.appendChild(
        renderFieldRow({
          key: field,
          value: state.multiScorer[field],
          onChange: (_, value) => onRootChange(field, value),
        }),
      );
    },
  );

  const table = document.createElement('table');
  table.className = 'ranker-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Ranking Name</th>
        <th>Asset Type</th>
        <th>Algorithm</th>
        <th>Exploit</th>
        <th>Base Score</th>
        <th>CIR Boost</th>
      </tr>
    </thead>
  `;

  const body = document.createElement('tbody');
  state.multiScorer.rankers.forEach((ranker, rankerIndex) => {
    const row = document.createElement('tr');
    const textCell = (field) => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = ranker[field] ?? '';
      input.addEventListener('input', () => onRankerChange(rankerIndex, field, input.value));
      td.appendChild(input);
      return td;
    };

    const boolCell = (field) => {
      const td = document.createElement('td');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = Boolean(ranker[field]);
      checkbox.addEventListener('change', () => onRankerChange(rankerIndex, field, checkbox.checked));
      td.appendChild(checkbox);
      return td;
    };

    row.append(
      textCell('rankingName'),
      textCell('assetType'),
      textCell('rankingAlgorithmName'),
      boolCell('isExploit'),
      boolCell('addBaseScore'),
      boolCell('addCirBoost'),
    );
    body.appendChild(row);
  });

  table.appendChild(body);
  card.append(heading, grid, table);
  container.appendChild(card);
}
