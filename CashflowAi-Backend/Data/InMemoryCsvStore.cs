using CashflowAi_Backend.Enums;
using System.Globalization;

namespace CashflowAi_Backend.Data;

public interface IDataStore
{
    decimal? GetMid(DateTime date, DateTime expiry, decimal strike, OptionType type);
    decimal? GetUnderlying(DateTime date);
    DateTime[] TradingDaysBetween(DateTime from, DateTime toInclusive);
    DateTime? PrevTradingDay(DateTime before);
}

public sealed class InMemoryCsvStore : IDataStore
{
    private readonly Dictionary<(DateTime d, DateTime e, decimal k, OptionType t), decimal> _mid = new();
    private readonly SortedDictionary<DateTime, decimal> _underlying = new();

    public InMemoryCsvStore(string csvPath)
    {
        if (!File.Exists(csvPath))
            throw new FileNotFoundException("CSV not found", csvPath);

        foreach (var (line, idx) in File.ReadLines(csvPath).Select((ln, i) => (ln, i)))
        {
            if (idx == 0 || string.IsNullOrWhiteSpace(line)) continue;
            var cols = line.Split(',', StringSplitOptions.TrimEntries);
            if (cols.Length < 6) continue;

            var date = DateTime.Parse(cols[0], CultureInfo.InvariantCulture).Date;
            var underlying = decimal.Parse(cols[1], CultureInfo.InvariantCulture);
            var expiry = DateTime.Parse(cols[2], CultureInfo.InvariantCulture).Date;
            var strike = decimal.Parse(cols[3], CultureInfo.InvariantCulture);
            var type = cols[4].Equals("call", StringComparison.OrdinalIgnoreCase) ? OptionType.Call : OptionType.Put;
            var mid = decimal.Parse(cols[5], CultureInfo.InvariantCulture);

            _mid[(date, expiry, strike, type)] = mid;
            _underlying[date] = underlying;
        }
    }

    public decimal? GetMid(DateTime date, DateTime expiry, decimal strike, OptionType type)
        => _mid.TryGetValue((date.Date, expiry.Date, strike, type), out var v) ? v : null;

    public decimal? GetUnderlying(DateTime date)
        => _underlying.TryGetValue(date.Date, out var v) ? v : null;

    public DateTime[] TradingDaysBetween(DateTime from, DateTime toInclusive)
        => _underlying.Keys.Where(d => d >= from.Date && d <= toInclusive.Date)
                           .OrderBy(d => d)
                           .ToArray();

    public DateTime? PrevTradingDay(DateTime before)
    {
        var keys = _underlying.Keys.Where(d => d < before.Date).OrderBy(d => d).ToArray();
        return keys.Length == 0 ? null : keys[^1];
    }
}