export function pValue(coef, se) {
    // Calculate the Wald statistic
    const waldStat = coef / se;

    // Calculate the p-value using the normal distribution
    const pValue = 2 * (1 - normalCDF(Math.abs(waldStat)));

    return pValue;
}
function normalCDF(x) {
    // Cumulative distribution function for the standard normal distribution
    return (1 + erf(x / Math.sqrt(2))) / 2;
}

// Taylor series approximation
function erf(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const t = 1.0 / (1.0 + p * x);
    const y =
        1.0 -
        ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
}
