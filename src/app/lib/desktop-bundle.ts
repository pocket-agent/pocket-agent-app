export function isDesktopBundle(): boolean {
  return import.meta.env.VITE_DESKTOP_BUNDLE === "true";
}

export const ONBOARDING_STORAGE_KEY = "pocket-agent-onboarding-complete";

export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markOnboardingComplete(): void {
  try {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
  } catch {
    /* ignore */
  }
}
