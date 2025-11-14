using CashflowAi_Backend.Enums;
using CashflowAi_Backend.Models;

namespace CashflowAi_Backend.Helpers;

public static class Pricer
{
    public static int Sign(Side s) => s == Side.Long ? +1 : -1;

    public static decimal Intrinsic(decimal S, decimal K, OptionType t)
        => t == OptionType.Call ? Math.Max(0, S - K) : Math.Max(0, K - S);

    public static decimal LegValueFromMid(decimal mid, Side side, int contracts)
        => Sign(side) * mid * 100m * contracts;

    public static decimal LegValueFromIntrinsic(decimal S, Leg leg)
        => Sign(leg.Side) * Intrinsic(S, leg.Strike, leg.Type) * 100m * leg.Contracts;
}