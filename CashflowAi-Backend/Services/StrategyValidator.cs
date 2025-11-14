namespace CashflowAi_Backend.Services;

public static class StrategyValidator
{
    public static void Validate(Strategy strategy)
    {
        if (string.IsNullOrWhiteSpace(strategy.StrategyType))
            throw new ArgumentException("Strategy type is required.");

        var strategyType = ParseStrategyType(strategy.StrategyType);

        switch (strategyType)
        {
            case Enums.StrategyType.CreditSpread:
                ValidateCreditSpread(strategy.Legs);
                break;
            case Enums.StrategyType.IronCondor:
                ValidateIronCondor(strategy.Legs);
                break;
            case Enums.StrategyType.SingleLeg:
                ValidateSingleLeg(strategy.Legs);
                break;
            case Enums.StrategyType.Custom:
                // No specific validation for custom strategies
                break;
        }
    }

    private static Enums.StrategyType ParseStrategyType(string strategyType)
    {
        return strategyType.ToLowerInvariant() switch
        {
            "creditspread" or "credit spread" => Enums.StrategyType.CreditSpread,
            "ironcondor" or "iron condor" => Enums.StrategyType.IronCondor,
            "singleleg" or "single leg" => Enums.StrategyType.SingleLeg,
            "custom" => Enums.StrategyType.Custom,
            _ => throw new ArgumentException($"Unknown strategy type: {strategyType}. Supported types: CreditSpread, IronCondor, SingleLeg, Custom")
        };
    }

    private static void ValidateSingleLeg(List<Leg> legs)
    {
        if (legs.Count != 1)
            throw new ArgumentException($"Single leg strategy must have exactly 1 leg. Found {legs.Count} legs.");
    }

    private static void ValidateCreditSpread(List<Leg> legs)
    {
        if (legs.Count != 2)
            throw new ArgumentException($"Credit spread must have exactly 2 legs. Found {legs.Count} legs.");

        var shortLeg = legs.FirstOrDefault(l => l.Side == Side.Short);
        var longLeg = legs.FirstOrDefault(l => l.Side == Side.Long);

        if (shortLeg == null)
            throw new ArgumentException("Credit spread must have a short leg.");

        if (longLeg == null)
            throw new ArgumentException("Credit spread must have a long leg.");

        // Both legs must be same type (both calls or both puts)
        if (shortLeg.Type != longLeg.Type)
            throw new ArgumentException($"Credit spread legs must be the same type. Found {shortLeg.Type} and {longLeg.Type}.");

        // Both legs must have same expiry
        if (shortLeg.Expiry != longLeg.Expiry)
            throw new ArgumentException("Credit spread legs must have the same expiry date.");

        // For a credit spread, the short strike should be closer to ATM
        // Call credit spread: short lower strike, long higher strike
        // Put credit spread: short higher strike, long lower strike
        if (shortLeg.Type == OptionType.Call)
        {
            if (shortLeg.Strike >= longLeg.Strike)
                throw new ArgumentException($"Call credit spread: short strike ({shortLeg.Strike}) must be less than long strike ({longLeg.Strike}).");
        }
        else // Put
        {
            if (shortLeg.Strike <= longLeg.Strike)
                throw new ArgumentException($"Put credit spread: short strike ({shortLeg.Strike}) must be greater than long strike ({longLeg.Strike}).");
        }

        // Both legs should have same number of contracts
        if (shortLeg.Contracts != longLeg.Contracts)
            throw new ArgumentException($"Credit spread legs must have the same number of contracts. Found {shortLeg.Contracts} and {longLeg.Contracts}.");
    }

    private static void ValidateIronCondor(List<Leg> legs)
    {
        if (legs.Count != 4)
            throw new ArgumentException($"Iron condor must have exactly 4 legs. Found {legs.Count} legs.");

        var callLegs = legs.Where(l => l.Type == OptionType.Call).ToList();
        var putLegs = legs.Where(l => l.Type == OptionType.Put).ToList();

        if (callLegs.Count != 2)
            throw new ArgumentException($"Iron condor must have exactly 2 call legs. Found {callLegs.Count}.");

        if (putLegs.Count != 2)
            throw new ArgumentException($"Iron condor must have exactly 2 put legs. Found {putLegs.Count}.");

        // Validate call spread
        var callShort = callLegs.FirstOrDefault(l => l.Side == Side.Short);
        var callLong = callLegs.FirstOrDefault(l => l.Side == Side.Long);

        if (callShort == null || callLong == null)
            throw new ArgumentException("Iron condor call spread must have one short and one long leg.");

        if (callShort.Strike >= callLong.Strike)
            throw new ArgumentException($"Iron condor call spread: short strike ({callShort.Strike}) must be less than long strike ({callLong.Strike}).");

        // Validate put spread
        var putShort = putLegs.FirstOrDefault(l => l.Side == Side.Short);
        var putLong = putLegs.FirstOrDefault(l => l.Side == Side.Long);

        if (putShort == null || putLong == null)
            throw new ArgumentException("Iron condor put spread must have one short and one long leg.");

        if (putShort.Strike <= putLong.Strike)
            throw new ArgumentException($"Iron condor put spread: short strike ({putShort.Strike}) must be greater than long strike ({putLong.Strike}).");

        // All legs must have same expiry
        var expiries = legs.Select(l => l.Expiry).Distinct().ToList();
        if (expiries.Count > 1)
            throw new ArgumentException("All iron condor legs must have the same expiry date.");

        // All legs should have same number of contracts
        var contracts = legs.Select(l => l.Contracts).Distinct().ToList();
        if (contracts.Count > 1)
            throw new ArgumentException("All iron condor legs must have the same number of contracts.");

        // Put short strike should be less than call short strike (no overlap)
        if (putShort.Strike >= callShort.Strike)
            throw new ArgumentException($"Iron condor: put short strike ({putShort.Strike}) must be less than call short strike ({callShort.Strike}).");
    }
}
