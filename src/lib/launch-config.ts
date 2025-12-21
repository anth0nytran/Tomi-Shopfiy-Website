export const launchConfig = {
  // Master switch for the countdown
  isEnabled: false,
  
  // Target launch date: December 22nd, 2025 at 10:00 AM CST (UTC-6)
  targetDate: "2025-12-22T10:00:00-06:00",
  
  // Test mode configuration for development
  testMode: {
    enabled: false, // Set to true to test the unlocking behavior
    durationInSeconds: 10, // How long the countdown lasts in test mode
  },

  // Optional password gate (client-side) to bypass the countdown for internal access.
  // Set `NEXT_PUBLIC_LAUNCH_ACCESS_PASSWORD` in your `.env` or hosting provider env vars.
  accessGate: {
    password: process.env.NEXT_PUBLIC_LAUNCH_ACCESS_PASSWORD ?? '',
    storageKey: 'tomi_launch_access_granted',
  },
}

