function getInputType(value) {
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'checkbox';
  return 'text';
}

export function renderFieldRow({ key, value, onChange }) {
  const row = document.createElement('label');
  row.className = 'field-row';

  const label = document.createElement('span');
  label.className = 'field-label';
  label.textContent = key;

  const input = document.createElement('input');
  const inputType = getInputType(value);
  input.type = inputType;

  if (inputType === 'checkbox') {
    input.checked = Boolean(value);
    input.addEventListener('change', () => onChange(key, input.checked));
  } else {
    input.value = value ?? '';
    input.placeholder = value === null ? 'null' : '';
    input.addEventListener('input', () => {
      const raw = input.value;
      if (raw === '') {
        onChange(key, null);
        return;
      }
      if (inputType === 'number') {
        const parsed = Number(raw);
        onChange(key, Number.isNaN(parsed) ? raw : parsed);
        return;
      }
      onChange(key, raw);
    });
  }

  row.append(label, input);
  return row;
}

export function renderCard(title, children = []) {
  const card = document.createElement('section');
  card.className = 'card';

  const heading = document.createElement('h2');
  heading.textContent = title;

  const body = document.createElement('div');
  body.className = 'card-grid';
  children.forEach((child) => body.appendChild(child));

  card.append(heading, body);
  return card;
}
