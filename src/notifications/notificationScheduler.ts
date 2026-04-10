/**
 * Notification Scheduler — pure function that turns CycleStats into
 * a list of ScheduledNotification objects.
 *
 * Contains ZERO native imports. Easy to unit-test.
 */

import { addDays, addMinutes, parseISO, setHours, setMinutes } from 'date-fns';
import type { CycleStats } from '../types/cycle';
import { NotificationEvent, ScheduledNotification } from './notificationTypes';

/**
 * Set notification time to 9:00 AM on the given date.
 * Users are most likely awake and can act on reminders.
 */
function at9am(date: Date): Date {
  return setMinutes(setHours(date, 9), 0);
}

/**
 * Build the full list of cycle-related notifications based on current stats.
 * Only includes notifications scheduled in the future.
 */
export function buildCycleNotifications(
  stats: CycleStats,
): ScheduledNotification[] {
  const now = new Date();
  const notifications: ScheduledNotification[] = [];

  const nextPeriod = parseISO(stats.nextPeriodDate);
  const ovulation = parseISO(stats.ovulationDate);
  const fertileStart = parseISO(stats.fertileWindowStart);

  // Helper: only push if the scheduled time is in the future
  const pushIfFuture = (n: ScheduledNotification) => {
    if (n.scheduledAt.getTime() > now.getTime()) {
      notifications.push(n);
    }
  };

  // ── 🧪 TEST: Uncomment to fire a notification 1 min from now ────────
  // notifications.push({
  //   id: 'test_1min',
  //   event: NotificationEvent.PERIOD_REMINDER_1D,
  //   title: '🧪 Test Notification',
  //   body: 'If you see this, notifications are working!',
  //   scheduledAt: addMinutes(now, 1),
  // });

  // ── Period reminders ─────────────────────────────────────────────────

  pushIfFuture({
    id: NotificationEvent.PERIOD_REMINDER_7D,
    event: NotificationEvent.PERIOD_REMINDER_7D,
    title: '🩸 Period in 7 days',
    body: 'Your period is expected in a week. Start keeping essentials handy.',
    scheduledAt: at9am(addDays(nextPeriod, -7)),
  });

  pushIfFuture({
    id: NotificationEvent.PERIOD_REMINDER_2D,
    event: NotificationEvent.PERIOD_REMINDER_2D,
    title: '🩸 Period in 2 days',
    body: 'Your period is almost here. Carry sanitary napkins today.',
    scheduledAt: at9am(addDays(nextPeriod, -2)),
  });

  pushIfFuture({
    id: NotificationEvent.PERIOD_REMINDER_1D,
    event: NotificationEvent.PERIOD_REMINDER_1D,
    title: '🩸 Period tomorrow',
    body: 'Your period is expected tomorrow. Be prepared!',
    scheduledAt: at9am(addDays(nextPeriod, -1)),
  });

  // ── Ovulation ────────────────────────────────────────────────────────

  pushIfFuture({
    id: NotificationEvent.OVULATION_DAY,
    event: NotificationEvent.OVULATION_DAY,
    title: '🌟 Ovulation Day',
    body: 'You might be ovulating today. Peak fertility window.',
    scheduledAt: at9am(ovulation),
  });

  // ── Fertile window ───────────────────────────────────────────────────

  pushIfFuture({
    id: NotificationEvent.FERTILE_WINDOW_START,
    event: NotificationEvent.FERTILE_WINDOW_START,
    title: '💖 Fertile Window Open',
    body: 'Your fertile window has started (5 days before ovulation).',
    scheduledAt: at9am(fertileStart),
  });

  // ── Luteal phase ─────────────────────────────────────────────────────

  pushIfFuture({
    id: NotificationEvent.LUTEAL_PHASE_START,
    event: NotificationEvent.LUTEAL_PHASE_START,
    title: '🌙 Luteal Phase',
    body: "You've entered the luteal phase. PMS symptoms may begin soon.",
    scheduledAt: at9am(addDays(ovulation, 3)),
  });

  return notifications;
}
