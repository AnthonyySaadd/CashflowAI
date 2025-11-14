namespace CashflowAi_Backend.Dtos;

public record Summary(
    decimal NetPL,
    decimal MaxDrawdown,
    bool Win,
    decimal InitialCost,
    decimal ReturnOnRisk,
    int TotalDays,
    int WinningDays,
    int LosingDays,
    decimal WinRate,
    decimal MaxGain,
    decimal MaxLoss
);
