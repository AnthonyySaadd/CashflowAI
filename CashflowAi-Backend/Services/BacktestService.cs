
namespace CashflowAi_Backend.Services;

public sealed class BacktestService
{
    private readonly IDataStore _db;
    public BacktestService(IDataStore db) => _db = db;

    private decimal PositionValueOn(DateTime d, Strategy s)
    {
        decimal total = 0m;

        foreach (var leg in s.Legs)
        {
            var mid = _db.GetMid(d, leg.Expiry, leg.Strike, leg.Type);
            if (mid is decimal m)
            {
                total += Pricer.LegValueFromMid(m, leg.Side, leg.Contracts);
                continue;
            }

            if (d.Date == leg.Expiry.Date)
            {
                var S = _db.GetUnderlying(d)
                        ?? (_db.PrevTradingDay(d) is DateTime p ? _db.GetUnderlying(p) : null)
                        ?? 0m;
                total += Pricer.LegValueFromIntrinsic(S, leg);
                continue;
            }

            throw new InvalidOperationException($"Missing mid for leg before expiry on {d:yyyy-MM-dd} (strike={leg.Strike}, type={leg.Type}, expiry={leg.Expiry:yyyy-MM-dd}).");
        }

        return total;
    }

    public BacktestResult Run(BacktestRequest req)
    {
        if (req.Legs is null || req.Legs.Count == 0)
            throw new ArgumentException("No legs supplied.");

        var strat = new Strategy(req.Symbol, req.StrategyType, req.Legs);

        // Validate strategy structure
        StrategyValidator.Validate(strat);

        var end = strat.Legs.Min(l => l.Expiry.Date);
        var days = _db.TradingDaysBetween(req.EntryDate.Date, end);

        if (days.Length == 0)
            throw new ArgumentException("No trading days between entry and expiry.");

        var v0 = PositionValueOn(days[0], strat);
        var ts = new List<TsPoint>(days.Length);
        decimal peak = decimal.MinValue;
        decimal mdd = 0m;
        decimal lastPL = 0m;
        decimal maxGain = decimal.MinValue;
        decimal maxLoss = decimal.MaxValue;
        int winningDays = 0;
        int losingDays = 0;

        foreach (var d in days)
        {
            var v = PositionValueOn(d, strat);
            var pl = v - v0;
            ts.Add(new TsPoint(d, v, pl));

            if (pl > peak) peak = pl;
            mdd = Math.Min(mdd, pl - peak);
            lastPL = pl;

            // Track max gain and max loss
            if (pl > maxGain) maxGain = pl;
            if (pl < maxLoss) maxLoss = pl;

            // Count winning and losing days
            if (pl > 0m) winningDays++;
            else if (pl < 0m) losingDays++;
        }

        var totalDays = days.Length;
        var winRate = totalDays > 0 ? (decimal)winningDays / totalDays * 100m : 0m;
        var initialCost = Math.Abs(v0);
        var returnOnRisk = initialCost > 0 ? (lastPL / initialCost) * 100m : 0m;

        return new BacktestResult(
            ts,
            new Summary(
                lastPL,
                mdd,
                lastPL > 0m,
                initialCost,
                returnOnRisk,
                totalDays,
                winningDays,
                losingDays,
                winRate,
                maxGain,
                maxLoss
            )
        );
    }
}