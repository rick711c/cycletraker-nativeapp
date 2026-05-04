/**
 * Haptic Feedback Utility
 *
 * Centralised haptic patterns so they're consistent across the app.
 * Uses the built-in Vibration API (works on all Android devices).
 */

import * as Haptics from 'expo-haptics';

/** Light tap — for toggles, checkbox, tab switches */
export function hapticLight() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function hapticMedium() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

export function hapticSuccess() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

export function hapticWarning() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
}
