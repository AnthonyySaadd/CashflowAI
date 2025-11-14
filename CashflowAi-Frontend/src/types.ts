export type OptionType = 'Call' | 'Put';
export type Side = 'Long' | 'Short';

export interface Leg {
    type: OptionType;
    strike: number;
    side: Side;
    contracts: number;
    expiry: string; // ISO string: "2025-01-05"
}

export interface BacktestRequest {
    symbol: string;
    entryDate: string; // ISO
    strategyType: string; // "singleLeg" | "creditSpread" | "ironCondor" etc.
    legs: Leg[];
}

export interface TsPoint {
    date: string;
    value: number;
    pl: number;
}

export interface Summary {
    netPL: number;
    maxDrawdown: number;
    win: boolean;
    initialCost: number;
    returnOnRisk: number;
    totalDays: number;
    winningDays: number;
    losingDays: number;
    winRate: number;
    maxGain: number;
    maxLoss: number;
}

export type StrategyType = 'CreditSpread' | 'IronCondor' | 'SingleLeg' | 'Custom';

export interface BacktestResult {
    timeseries: TsPoint[];
    summary: Summary;
}
