export const launchConfig = {
  // Master switch for the countdown
  isEnabled: true,
  
  // Target launch date: December 22nd, 2025 at 10:00 AM CST (UTC-6)
  targetDate: "2025-12-22T10:00:00-06:00",
  
  // Test mode configuration for development
  testMode: {
    enabled: true, // Set to true to test the unlocking behavior
    durationInSeconds: 10, // How long the countdown lasts in test mode
  }
}

