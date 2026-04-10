/**
 * Haptic Feedback Utility
 *
 * Centralised haptic patterns so they're consistent across the app.
 * Uses the built-in Vibration API (works on all Android devices).
 */

import { Vibration } from 'react-native';

/** Light tap — for toggles, checkbox, tab switches */
export function hapticLight() {
  Vibration.vibrate(15);
}

/** Medium tap — for button presses, confirmations */
export function hapticMedium() {
  Vibration.vibrate(30);
}

/** Success — for completed actions (period logged, onboarding done) */
export function hapticSuccess() {
  Vibration.vibrate([0, 20, 80, 20]);
}

/** Warning — for destructive confirmations (clear data) */
export function hapticWarning() {
  Vibration.vibrate(50);
}
