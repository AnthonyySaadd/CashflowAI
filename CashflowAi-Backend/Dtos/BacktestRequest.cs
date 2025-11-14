using CashflowAi_Backend.Models;

namespace CashflowAi_Backend.Dtos;

public record BacktestRequest(
    string Symbol,
    DateTime EntryDate,
    string StrategyType,
    List<Leg> Legs);
