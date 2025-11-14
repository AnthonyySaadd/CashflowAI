import React from 'react';
import type { BacktestResult } from '../types';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';

interface Props {
    result: BacktestResult | null;
    loading: boolean;
}

const Results: React.FC<Props> = ({ result, loading }) => {
    if (loading) {
        return (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center h-[700px]">
                <div className="text-center">
                    <div className="relative">
                        <svg className="animate-spin h-16 w-16 text-blue-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <div className="absolute inset-0 bg-blue-400/20 blur-2xl rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-gray-700 font-bold text-lg">Running Backtest...</p>
                    <p className="text-gray-500 text-sm mt-2">Calculating P/L and metrics</p>
                </div>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 flex items-center justify-center h-[700px]">
                <div className="text-center text-gray-400">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full p-8 inline-block mb-6">
                        <svg className="h-20 w-20 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <p className="text-xl font-bold text-gray-700">No Results Yet</p>
                    <p className="text-sm mt-2 text-gray-500">Configure a strategy and run a backtest to see results</p>
                </div>
            </div>
        );
    }

    const { summary, timeseries } = result;

    // Format data for Recharts
    const chartData = timeseries.map((p) => ({
        date: p.date.slice(0, 10),
        pl: p.pl,
    }));

    const isProfit = summary.netPL > 0;

    return (
        <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-6 space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 -m-6 mb-6 p-6 rounded-t-3xl">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Backtest Results
                </h2>
                <p className="text-cyan-100 text-sm mt-1">Performance metrics and analysis</p>
            </div>

            {/* Summary Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
                {/* Net P/L Card */}
                <div className={`rounded-xl p-3 ${isProfit ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300' : 'bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300'}`}>
                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">Net P/L</div>
                    <div className={`text-xl font-black ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
                        ${summary.netPL.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 font-semibold">
                        {isProfit ? '↑ Profit' : '↓ Loss'}
                    </div>
                </div>

                {/* Return on Risk Card */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-3">
                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">Return on Risk</div>
                    <div className="text-xl font-black text-blue-700">
                        {summary.returnOnRisk.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 font-semibold">
                        Initial: ${summary.initialCost.toFixed(0)}
                    </div>
                </div>

                {/* Win Rate Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-3">
                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">Win Rate</div>
                    <div className="text-xl font-black text-purple-700">
                        {summary.winRate.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 font-semibold">
                        {summary.winningDays}/{summary.totalDays} days
                    </div>
                </div>

                {/* Max Drawdown Card */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3">
                    <div className="text-[10px] font-bold text-gray-600 uppercase tracking-wide mb-1">Max Drawdown</div>
                    <div className="text-xl font-black text-orange-700">
                        ${summary.maxDrawdown.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-gray-500 mt-0.5 font-semibold">
                        Peak to trough
                    </div>
                </div>
            </div>

            {/* Additional Metrics */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Additional Metrics</h3>
                <div className="grid grid-cols-3 gap-3">
                    <div>
                        <div className="text-[10px] text-gray-600 mb-1 font-semibold">Max Gain</div>
                        <div className="text-base font-bold text-green-600">${summary.maxGain.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-600 mb-1 font-semibold">Max Loss</div>
                        <div className="text-base font-bold text-red-600">${summary.maxLoss.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-600 mb-1 font-semibold">Total Days</div>
                        <div className="text-base font-bold text-gray-800">{summary.totalDays}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-600 mb-1 font-semibold">Winning Days</div>
                        <div className="text-base font-bold text-green-600">{summary.winningDays}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-600 mb-1 font-semibold">Losing Days</div>
                        <div className="text-base font-bold text-red-600">{summary.losingDays}</div>
                    </div>
                    <div>
                        <div className="text-[10px] text-gray-600 mb-1 font-semibold">Final Result</div>
                        <div className={`text-base font-bold ${summary.win ? 'text-green-600' : 'text-red-600'}`}>
                            {summary.win ? '✓ Win' : '✗ Loss'}
                        </div>
                    </div>
                </div>
            </div>

            {/* P/L Chart */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">P/L Over Time</h3>
                <div className="w-full h-64">
                    <ResponsiveContainer>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                stroke="#6b7280"
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                stroke="#6b7280"
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <ReferenceLine y={0} stroke="#9ca3af" strokeDasharray="3 3" />
                            <Line
                                type="monotone"
                                dataKey="pl"
                                stroke={isProfit ? '#10b981' : '#ef4444'}
                                strokeWidth={3}
                                dot={{ fill: isProfit ? '#10b981' : '#ef4444', r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Timeseries Table */}
            <div className="bg-gray-50 rounded-2xl p-4 border-2 border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Detailed Timeseries</h3>
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-white sticky top-0">
                            <tr className="border-b-2 border-gray-300">
                                <th className="px-3 py-2 text-left text-[10px] font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                <th className="px-3 py-2 text-right text-[10px] font-bold text-gray-600 uppercase tracking-wider">Value</th>
                                <th className="px-3 py-2 text-right text-[10px] font-bold text-gray-600 uppercase tracking-wider">P/L</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {timeseries.map((p, idx) => (
                                <tr key={p.date} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                    <td className="px-3 py-2 text-xs text-gray-700 font-medium">{p.date.slice(0, 10)}</td>
                                    <td className="px-3 py-2 text-xs text-right text-gray-700">${p.value.toFixed(2)}</td>
                                    <td className={`px-3 py-2 text-xs text-right font-bold ${p.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        ${p.pl.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Results;
