import type { BacktestRequest, BacktestResult } from './types';

// change this to match your backend
const API_BASE = 'https://localhost:7279';

export async function runBacktest(body: BacktestRequest): Promise<BacktestResult> {
    const res = await fetch(`${API_BASE}/api/Backtest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed with status ${res.status}`);
    }

    return res.json();
}
