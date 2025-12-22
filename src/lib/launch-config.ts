export const launchConfig = {
  // Master switch for the countdown
  // Env-driven so prod can’t be accidentally blocked by a committed boolean.
  isEnabled: process.env.NEXT_PUBLIC_LAUNCH_COUNTDOWN_ENABLED === 'true',
  
  // Target launch date: December 22nd, 2025 at 10:00 AM CST (UTC-6)
  targetDate: "2025-12-22T10:00:00-06:00",
  
  // Test mode configuration for development
  testMode: {
    // Enable to test the unlock behavior without waiting for the real targetDate.
    enabled: process.env.NEXT_PUBLIC_LAUNCH_TEST_MODE === 'true',
    durationInSeconds: Math.max(
      1,
      parseInt(process.env.NEXT_PUBLIC_LAUNCH_TEST_DURATION_SECONDS ?? '10', 10) || 10,
    ),
  },

  // Optional password gate (client-side) to bypass the countdown for internal access.
  // Set `NEXT_PUBLIC_LAUNCH_ACCESS_PASSWORD` in your `.env` or hosting provider env vars.
  accessGate: {
    password: process.env.NEXT_PUBLIC_LAUNCH_ACCESS_PASSWORD ?? '',
    // When you bump NEXT_PUBLIC_LAUNCH_ACCESS_RESET_TOKEN and redeploy,
    // everybody will be required to re-enter the password (old localStorage keys won't match).
    storageKeyBase: 'tomi_launch_access_granted',
    resetToken: (process.env.NEXT_PUBLIC_LAUNCH_ACCESS_RESET_TOKEN ?? '0').trim() || '0',
    storageKey: `tomi_launch_access_granted:${(process.env.NEXT_PUBLIC_LAUNCH_ACCESS_RESET_TOKEN ?? '0').trim() || '0'}`,
  },
}

