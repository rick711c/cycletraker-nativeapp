import { addDays, parseISO, setHours, setMinutes } from "date-fns";
import type { CycleStats } from "../types/cycle";
import { NotificationEvent, ScheduledNotification } from "./notificationTypes";

function at9am(date: Date): Date {
  return setMinutes(setHours(date, 9), 0);
}

export function buildCycleNotifications(
  stats: CycleStats,
): ScheduledNotification[] {
  const now = new Date();
  const notifications: ScheduledNotification[] = [];

  const nextPeriod = parseISO(stats.nextPeriodDate);
  const ovulation = parseISO(stats.ovulationDate);
  const fertileStart = parseISO(stats.fertileWindowStart);

  const pushIfFuture = (n: ScheduledNotification) => {
    if (n.scheduledAt.getTime() > now.getTime()) {
      notifications.push(n);
    }
  };

  pushIfFuture({
    id: NotificationEvent.PERIOD_REMINDER_7D,
    event: NotificationEvent.PERIOD_REMINDER_7D,
    title: "🩸 Period in 7 days",
    body: "Your period is expected in a week. Start keeping essentials handy.",
    scheduledAt: at9am(addDays(nextPeriod, -7)),
  });

  pushIfFuture({
    id: NotificationEvent.PERIOD_REMINDER_2D,
    event: NotificationEvent.PERIOD_REMINDER_2D,
    title: "🩸 Period in 2 days",
    body: "Your period is almost here. Carry sanitary napkins today.",
    scheduledAt: at9am(addDays(nextPeriod, -2)),
  });

  pushIfFuture({
    id: NotificationEvent.PERIOD_REMINDER_1D,
    event: NotificationEvent.PERIOD_REMINDER_1D,
    title: "🩸 Period tomorrow",
    body: "Your period is expected tomorrow. Be prepared!",
    scheduledAt: at9am(addDays(nextPeriod, -1)),
  });

  pushIfFuture({
    id: NotificationEvent.OVULATION_DAY,
    event: NotificationEvent.OVULATION_DAY,
    title: "🌟 Ovulation Day",
    body: "You might be ovulating today. Peak fertility window.",
    scheduledAt: at9am(ovulation),
  });

  pushIfFuture({
    id: NotificationEvent.FERTILE_WINDOW_START,
    event: NotificationEvent.FERTILE_WINDOW_START,
    title: "💖 Fertile Window Open",
    body: "Your fertile window has started (5 days before ovulation).",
    scheduledAt: at9am(fertileStart),
  });

  pushIfFuture({
    id: NotificationEvent.LUTEAL_PHASE_START,
    event: NotificationEvent.LUTEAL_PHASE_START,
    title: "🌙 Luteal Phase",
    body: "You've entered the luteal phase. PMS symptoms may begin soon.",
    scheduledAt: at9am(addDays(ovulation, 3)),
  });

  return notifications;
}
