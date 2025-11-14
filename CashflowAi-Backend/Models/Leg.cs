
namespace CashflowAi_Backend.Models;

public record Leg(
    OptionType Type,
    decimal Strike,
    Side Side,
    int Contracts,
    DateTime Expiry);