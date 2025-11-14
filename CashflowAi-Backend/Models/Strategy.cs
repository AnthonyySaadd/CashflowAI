namespace CashflowAi_Backend.Models;

public record Strategy(string Symbol, string StrategyType, List<Leg> Legs);