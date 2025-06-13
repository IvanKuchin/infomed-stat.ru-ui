// Cox Proportional Hazards for a single binary covariate (Group2_T)
// T: array of times, 
// E: array of events (1=event, 0=censored), 
// X: array of covariate (0/1)

export function coxphFit(T, E, X, maxIter = 50, tol = 1e-6) {
  let check = sanityCheck(T, E, X);
  if (check.status === false) {
    throw new Error(check.message);
  }

  // Sort by time ascending
  const n = T.length;
  let idx = Array.from({ length: n }, (_, i) => i);
  idx.sort((a, b) => T[a] - T[b]);
  T = idx.map(i => T[i]);
  E = idx.map(i => E[i]);
  X = idx.map(i => X[i]);

  // Newton-Raphson for single covariate
  let beta = 0;
  for (let iter = 0; iter < maxIter; iter++) {
    let score = 0, info = 0;
    for (let i = 0; i < n; i++) {
      if (E[i] === 1) {
        let riskset = 0, risksetX = 0, risksetXX = 0;
        for (let j = i; j < n; j++) {
          const expbx = Math.exp(beta * X[j]);
          riskset += expbx;
          risksetX += expbx * X[j];
          risksetXX += expbx * X[j] * X[j];
        }
        score += X[i] - (risksetX / riskset);
        info += (risksetXX / riskset) - Math.pow(risksetX / riskset, 2);
      }
    }
    const delta = score / info;
    beta += delta;
    if (Math.abs(delta) < tol) break;
  }

  // Standard error
  let info = 0;
  for (let i = 0; i < n; i++) {
    if (E[i] === 1) {
      let riskset = 0, risksetX = 0, risksetXX = 0;
      for (let j = i; j < n; j++) {
        const expbx = Math.exp(beta * X[j]);
        riskset += expbx;
        risksetX += expbx * X[j];
        risksetXX += expbx * X[j] * X[j];
      }
      info += (risksetXX / riskset) - Math.pow(risksetX / riskset, 2);
    }
  }
  const se = 1 / Math.sqrt(info);

  // Hazard ratio
  const hr = Math.exp(beta);

  // Confidence intervals (Wald)
  const z = 1.96;
  const coef_lower = Math.exp(beta - z * se);
  const coef_upper = Math.exp(beta + z * se);

  return {
    coef: beta,
    se: se,
    hr: hr,
    coef_lower: coef_lower,
    coef_upper: coef_upper,
  };
}

function sanityCheck(T, E, X) {
  if (!Array.isArray(T) || !Array.isArray(E) || !Array.isArray(X)) {
    return { status: false, message: "Input must be arrays." };
  }
  if (T.length !== E.length || T.length !== X.length) {
    return { status: false, message: "Input arrays must have the same length." };
  }
  for (let i = 0; i < T.length; i++) {
    if (typeof T[i] !== 'number' || typeof E[i] !== 'number' || typeof X[i] !== 'number') {
      return { status: false, message: "All elements in T, E, and X must be numbers." };
    }
    if (E[i] !== 0 && E[i] !== 1) {
      return { status: false, message: "E must be binary (0 or 1)." };
    }
    if (X[i] !== 0 && X[i] !== 1) {
      return { status: false, message: "X must be binary (0 or 1)." };
    }
  }
  return true;
}