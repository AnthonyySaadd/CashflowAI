namespace CashflowAi_Backend.Dtos;

public record BacktestResult(List<TsPoint> Timeseries, Summary Summary);
