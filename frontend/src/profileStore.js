// Operative Profile storage helpers.
// The profile lives in the browser (localStorage), so it survives refreshes
// without needing a database on the backend.

export const STORAGE_KEY = 'navam.operativeProfile.v1';

export const RISK_PROFILES = ['conservative', 'balanced', 'aggressive'];

export const DEFAULT_PROFILE = {
  codename: '',
  monthlyIncome: 5000,
  monthlyExpenses: 3000,
  currentSavings: 10000,
  monthlyInvestment: 800,
  riskProfile: 'balanced',
  targetAmount: 500000,
  targetYears: 20,
};

const clampNumber = (value, min = 0, max = Infinity) => {
  const n = Number(value);
  if (!Number.isFinite(n)) return min;
  return Math.min(Math.max(n, min), max);
};

// Turns whatever is in the form (including empty strings) into clean, valid values.
export function normalizeProfile(profile) {
  return {
    codename: String(profile?.codename ?? '').trim().slice(0, 24),
    monthlyIncome: clampNumber(profile?.monthlyIncome),
    monthlyExpenses: clampNumber(profile?.monthlyExpenses),
    currentSavings: clampNumber(profile?.currentSavings),
    monthlyInvestment: clampNumber(profile?.monthlyInvestment),
    riskProfile: RISK_PROFILES.includes(profile?.riskProfile) ? profile.riskProfile : 'balanced',
    targetAmount: clampNumber(profile?.targetAmount, 1),
    targetYears: Math.round(clampNumber(profile?.targetYears, 1, 40)),
  };
}

export function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return normalizeProfile(DEFAULT_PROFILE);
    return normalizeProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
  } catch {
    return normalizeProfile(DEFAULT_PROFILE);
  }
}

// Returns true when the profile was stored, false if the browser blocked it.
export function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeProfile(profile)));
    return true;
  } catch {
    return false;
  }
}