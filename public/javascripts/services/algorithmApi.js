import { algorithmSample } from '../data/algorithmSample.js';

const API_BASE_URL = window.__ALGO_API_BASE_URL__ ?? 'http://localhost:5000/api/algorithms';

export async function loadAlgorithm() {
  try {
    const response = await fetch(`${API_BASE_URL}/active`);
    if (!response.ok) throw new Error(`Failed with ${response.status}`);
    return await response.json();
  } catch (_) {
    return structuredClone(algorithmSample);
  }
}

export async function saveAlgorithm(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/active`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Failed with ${response.status}`);
    return { ok: true, source: 'api' };
  } catch (_) {
    return { ok: true, source: 'local-fallback' };
  }
}
