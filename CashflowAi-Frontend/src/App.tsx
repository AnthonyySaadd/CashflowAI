import React, { useState } from 'react';
import StrategyForm from './components/StrategyForm';
import Results from './components/Results';
import type { BacktestResult } from './types';

const App: React.FC = () => {
    const [result, setResult] = useState<BacktestResult | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1800px] mx-auto">
                {/* Modern Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                            Cashflow <span className="text-cyan-300">AI</span>
                        </h1>
                    </div>
                    <p className="text-xl text-white/90 font-medium mb-2">Options Strategy Backtester</p>
                    <p className="text-sm text-white/70 max-w-2xl mx-auto">
                        Professional-grade backtesting for credit spreads, iron condors, and single leg options strategies
                    </p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="bg-white rounded-xl shadow-2xl border border-red-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <p className="text-white font-semibold">Error</p>
                                        <p className="text-sm text-white/90">{error}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setError('')}
                                    className="text-white hover:bg-white/20 rounded-lg p-1.5 transition"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                    {/* Strategy Builder - Left Side */}
                    <div className="xl:col-span-2">
                        <StrategyForm
                            onResult={(r) => {
                                setResult(r);
                                setError('');
                                setLoading(false);
                            }}
                            onError={(msg) => {
                                setError(msg);
                                setResult(null);
                                setLoading(false);
                            }}
                            onLoadingChange={setLoading}
                        />
                    </div>

                    {/* Results - Right Side (Larger) */}
                    <div className="xl:col-span-3">
                        <Results result={result} loading={loading} />
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-white/60 text-sm">
                    <p>Built with ASP.NET Core 9.0 • React 19 • TypeScript • Tailwind CSS</p>
                </div>
            </div>
        </div>
    );
};

export default App;
