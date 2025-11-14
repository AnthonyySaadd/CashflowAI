import React, { useState } from 'react';
import { runBacktest } from '../api';
import type { BacktestRequest, BacktestResult, Leg, StrategyType, OptionType, Side } from '../types';

interface Props {
    onResult: (result: BacktestResult) => void;
    onError: (message: string) => void;
    onLoadingChange: (loading: boolean) => void;
}

const StrategyForm: React.FC<Props> = ({ onResult, onError, onLoadingChange }) => {
    const [symbol, setSymbol] = useState('SPX');
    const [entryDate, setEntryDate] = useState('2025-01-02');
    const [expiry, setExpiry] = useState('2025-01-05');
    const [strategyType, setStrategyType] = useState<StrategyType>('SingleLeg');
    const [loading, setLoading] = useState(false);

    // Single Leg state
    const [slOptionType, setSlOptionType] = useState<OptionType>('Call');
    const [slSide, setSlSide] = useState<Side>('Long');
    const [slStrike, setSlStrike] = useState(4800);
    const [slContracts, setSlContracts] = useState(1);

    // Credit Spread state
    const [csOptionType, setCsOptionType] = useState<OptionType>('Call');
    const [csShortStrike, setCsShortStrike] = useState(4800);
    const [csLongStrike, setCsLongStrike] = useState(4850);
    const [csContracts, setCsContracts] = useState(1);

    // Iron Condor state
    const [icPutShortStrike, setIcPutShortStrike] = useState(4750);
    const [icPutLongStrike, setIcPutLongStrike] = useState(4700);
    const [icCallShortStrike, setIcCallShortStrike] = useState(4850);
    const [icCallLongStrike, setIcCallLongStrike] = useState(4900);
    const [icContracts, setIcContracts] = useState(1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        onLoadingChange(true);

        try {
            let legs: Leg[] = [];

            if (strategyType === 'SingleLeg') {
                legs = [
                    {
                        type: slOptionType,
                        strike: slStrike,
                        side: slSide,
                        contracts: slContracts,
                        expiry,
                    },
                ];
            } else if (strategyType === 'CreditSpread') {
                legs = [
                    {
                        type: csOptionType,
                        strike: csShortStrike,
                        side: 'Short',
                        contracts: csContracts,
                        expiry,
                    },
                    {
                        type: csOptionType,
                        strike: csLongStrike,
                        side: 'Long',
                        contracts: csContracts,
                        expiry,
                    },
                ];
            } else if (strategyType === 'IronCondor') {
                legs = [
                    // Put spread
                    {
                        type: 'Put',
                        strike: icPutShortStrike,
                        side: 'Short',
                        contracts: icContracts,
                        expiry,
                    },
                    {
                        type: 'Put',
                        strike: icPutLongStrike,
                        side: 'Long',
                        contracts: icContracts,
                        expiry,
                    },
                    // Call spread
                    {
                        type: 'Call',
                        strike: icCallShortStrike,
                        side: 'Short',
                        contracts: icContracts,
                        expiry,
                    },
                    {
                        type: 'Call',
                        strike: icCallLongStrike,
                        side: 'Long',
                        contracts: icContracts,
                        expiry,
                    },
                ];
            }

            const request: BacktestRequest = {
                symbol,
                entryDate,
                strategyType,
                legs,
            };

            const result = await runBacktest(request);
            onResult(result);
        } catch (err: any) {
            onError(err.message || 'Failed to run backtest');
        } finally {
            setLoading(false);
            onLoadingChange(false);
        }
    };

    return (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Strategy Builder
                </h2>
                <p className="text-blue-100 text-sm mt-1">Configure your options strategy</p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Base Parameters */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Base Parameters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Symbol</label>
                            <input
                                type="text"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                                placeholder="SPX"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Strategy Type</label>
                            <div className="relative">
                                <select
                                    value={strategyType}
                                    onChange={(e) => setStrategyType(e.target.value as StrategyType)}
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium appearance-none cursor-pointer"
                                    required
                                >
                                    <option value="SingleLeg">📊 Single Leg</option>
                                    <option value="CreditSpread">📈 Credit Spread</option>
                                    <option value="IronCondor">🦅 Iron Condor</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Entry Date</label>
                            <input
                                type="date"
                                value={entryDate}
                                onChange={(e) => setEntryDate(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                            <input
                                type="date"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Strategy-Specific Configuration */}
                <div className="border-t-2 border-gray-100 pt-6">
                    {strategyType === 'SingleLeg' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-xl">
                                    📊
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Single Leg Options</h3>
                                    <p className="text-xs text-gray-500">Buy or sell a single call or put</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Option Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSlOptionType('Call')}
                                            className={`py-2 px-4 rounded-lg font-semibold transition ${
                                                slOptionType === 'Call'
                                                    ? 'bg-green-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Call
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSlOptionType('Put')}
                                            className={`py-2 px-4 rounded-lg font-semibold transition ${
                                                slOptionType === 'Put'
                                                    ? 'bg-red-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Put
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setSlSide('Long')}
                                            className={`py-2 px-4 rounded-lg font-semibold transition ${
                                                slSide === 'Long'
                                                    ? 'bg-blue-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Buy
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSlSide('Short')}
                                            className={`py-2 px-4 rounded-lg font-semibold transition ${
                                                slSide === 'Short'
                                                    ? 'bg-orange-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Sell
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Strike Price</label>
                                    <input
                                        type="number"
                                        value={slStrike}
                                        onChange={(e) => setSlStrike(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition font-medium"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contracts</label>
                                    <input
                                        type="number"
                                        value={slContracts}
                                        onChange={(e) => setSlContracts(Number(e.target.value))}
                                        min="1"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {strategyType === 'CreditSpread' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xl">
                                    📈
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Credit Spread</h3>
                                    <p className="text-xs text-gray-500">Sell one option, buy another at a different strike</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Option Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setCsOptionType('Call')}
                                            className={`py-2 px-4 rounded-lg font-semibold transition ${
                                                csOptionType === 'Call'
                                                    ? 'bg-green-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Call
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setCsOptionType('Put')}
                                            className={`py-2 px-4 rounded-lg font-semibold transition ${
                                                csOptionType === 'Put'
                                                    ? 'bg-red-600 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            Put
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Contracts</label>
                                    <input
                                        type="number"
                                        value={csContracts}
                                        onChange={(e) => setCsContracts(Number(e.target.value))}
                                        min="1"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Short Strike
                                        <span className="ml-1 text-xs text-orange-600">(Sell)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={csShortStrike}
                                        onChange={(e) => setCsShortStrike(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Long Strike
                                        <span className="ml-1 text-xs text-blue-600">(Buy)</span>
                                    </label>
                                    <input
                                        type="number"
                                        value={csLongStrike}
                                        onChange={(e) => setCsLongStrike(Number(e.target.value))}
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition font-medium"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {strategyType === 'IronCondor' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-xl">
                                    🦅
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">Iron Condor</h3>
                                    <p className="text-xs text-gray-500">Combine a put spread and call spread for range-bound profit</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Contracts</label>
                                <input
                                    type="number"
                                    value={icContracts}
                                    onChange={(e) => setIcContracts(Number(e.target.value))}
                                    min="1"
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition font-medium"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Put Spread */}
                                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 space-y-3">
                                    <h4 className="font-bold text-red-900 flex items-center gap-2">
                                        <span>📉</span> Put Spread
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Short Strike</label>
                                        <input
                                            type="number"
                                            value={icPutShortStrike}
                                            onChange={(e) => setIcPutShortStrike(Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-white border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Long Strike</label>
                                        <input
                                            type="number"
                                            value={icPutLongStrike}
                                            onChange={(e) => setIcPutLongStrike(Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-white border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition text-sm font-medium"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Call Spread */}
                                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 space-y-3">
                                    <h4 className="font-bold text-green-900 flex items-center gap-2">
                                        <span>📈</span> Call Spread
                                    </h4>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Short Strike</label>
                                        <input
                                            type="number"
                                            value={icCallShortStrike}
                                            onChange={(e) => setIcCallShortStrike(Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-white border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm font-medium"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-1">Long Strike</label>
                                        <input
                                            type="number"
                                            value={icCallLongStrike}
                                            onChange={(e) => setIcCallLongStrike(Number(e.target.value))}
                                            className="w-full px-3 py-2 bg-white border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition text-sm font-medium"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white font-bold py-4 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:transform-none"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-3">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Running Backtest...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Run Backtest
                        </span>
                    )}
                </button>
            </form>
        </div>
    );
};

export default StrategyForm;
