import Icon from "@/src/components/ui/Icon";
import {
    addMonths,
    differenceInDays,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    isBefore,
    isSameDay,
    isSameMonth,
    isWithinInterval,
    parseISO,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import * as Haptics from "expo-haptics";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    PanResponder,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import {
    Button,
    Card,
    Divider,
    IconButton,
    Portal,
    Snackbar,
    Text,
    useTheme,
} from "react-native-paper";

import { getInsightForDay } from "@/src/lib/insightHelpers";
import { useAppDispatch, useAppSelector } from "@/src/store";
import {
    changePeriodDateRequest,
    getPhaseForDate,
    selectDayLogs,
    selectSettings,
} from "@/src/store/cycleSlice";
import { CyclePhase } from "@/src/types/cycle";
import { AppMode } from "@/src/types/insight";

const cyclePhaseColors: Record<CyclePhase, string> = {
  menstruation: "#FF5252",
  follicular: "#448AFF",
  ovulation: "#69F0AE",
  luteal: "#FFAB40",
};

const phaseLabels: Record<CyclePhase, string> = {
  menstruation: "Period",
  follicular: "Follicular",
  ovulation: "Ovulation",
  luteal: "Luteal",
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
type EditMode = "idle" | "selectStart" | "selectEnd";

export default function CalendarScreen() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const dayLogs = useAppSelector(selectDayLogs);
  const settings = useAppSelector(selectSettings);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const appMode: AppMode =
    settings.goal === "conceive"
      ? "tryToConceive"
      : settings.goal === "pregnancy"
        ? "trackPregnancy"
        : "trackCycle";

  const [editMode, setEditMode] = useState<EditMode>("idle");
  const [editStart, setEditStart] = useState<Date | null>(null);
  const [editEnd, setEditEnd] = useState<Date | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const isToday = (date: Date) => isSameDay(date, new Date());

  const getDayStatus = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const log = dayLogs.find((l) => l.date === dateStr);
    const phase = getPhaseForDate(settings, dateStr);
    return { log, phase };
  };

  const isInEditRange = (date: Date): boolean => {
    if (!editStart) return false;
    if (editMode === "selectEnd" && !editEnd) return isSameDay(date, editStart);
    if (editStart && editEnd) {
      return (
        isSameDay(date, editStart) ||
        isSameDay(date, editEnd) ||
        isWithinInterval(date, { start: editStart, end: editEnd })
      );
    }
    return isSameDay(date, editStart);
  };

  const isEditStart = (date: Date) => editStart && isSameDay(date, editStart);
  const isEditEnd = (date: Date) => editEnd && isSameDay(date, editEnd);

  const handleDayPress = (day: Date) => {
    if (editMode === "idle") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelectedDay((prev) => (prev && isSameDay(prev, day) ? null : day));
      return;
    }

    const todayStr = format(new Date(), "yyyy-MM-dd");
    const dayStr = format(day, "yyyy-MM-dd");
    if (dayStr > todayStr) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      setSnackbarVisible(true);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (editMode === "selectStart") {
      setEditStart(day);
      setEditEnd(null);
      setEditMode("selectEnd");
    } else if (editMode === "selectEnd") {
      if (editStart && isBefore(day, editStart)) {
        setEditEnd(editStart);
        setEditStart(day);
      } else {
        setEditEnd(day);
      }
    }
  };

  const handleStartEdit = () => {
    setEditMode("selectStart");
    setEditStart(null);
    setEditEnd(null);
    setSelectedDay(null);
  };
  const handleCancelEdit = () => {
    setEditMode("idle");
    setEditStart(null);
    setEditEnd(null);
  };
  const handleSaveEdit = () => {
    if (editStart && editEnd) {
      dispatch(
        changePeriodDateRequest({
          startDate: format(editStart, "yyyy-MM-dd"),
          endDate: format(editEnd, "yyyy-MM-dd"),
        }),
      );
      setSelectedDay(editStart);
    }
    setEditMode("idle");
    setEditStart(null);
    setEditEnd(null);
  };

  const screenWidth = Dimensions.get("window").width;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateMonth = useCallback(
    (direction: "left" | "right") => {
      const exitTarget = direction === "left" ? -screenWidth : screenWidth;
      const enterFrom = direction === "left" ? screenWidth : -screenWidth;
      Animated.timing(slideAnim, {
        toValue: exitTarget,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setCurrentMonth((prev) =>
          direction === "left" ? addMonths(prev, 1) : subMonths(prev, 1),
        );
        slideAnim.setValue(enterFrom);
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 12,
        }).start();
      });
    },
    [screenWidth, slideAnim],
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gs) =>
        Math.abs(gs.dx) > Math.abs(gs.dy) && Math.abs(gs.dx) > 15,
      onPanResponderRelease: (_, gs) => {
        if (gs.dx < -50) animateMonth("left");
        else if (gs.dx > 50) animateMonth("right");
      },
    }),
  ).current;

  const editInstruction =
    editMode === "selectStart"
      ? "Tap the first day of your period"
      : editMode === "selectEnd"
        ? "Now tap the last day of your period"
        : null;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.monthTitle}>
          {format(currentMonth, "MMMM yyyy")}
        </Text>
        {editMode === "idle" && (
          <IconButton
            icon="pencil-outline"
            size={22}
            iconColor={cyclePhaseColors.menstruation}
            onPress={handleStartEdit}
          />
        )}
      </View>

      {editInstruction && (
        <View
          style={[
            styles.editBanner,
            { backgroundColor: `${cyclePhaseColors.menstruation}15` },
          ]}
        >
          <Icon
            name="calendar-edit"
            size={20}
            color={cyclePhaseColors.menstruation}
          />
          <Text
            variant="bodyMedium"
            style={{
              color: cyclePhaseColors.menstruation,
              fontWeight: "600",
              marginLeft: 10,
              flex: 1,
            }}
          >
            {editInstruction}
          </Text>
          <IconButton
            icon="close"
            size={18}
            iconColor={theme.colors.onSurfaceVariant}
            onPress={handleCancelEdit}
          />
        </View>
      )}

      <View {...panResponder.panHandlers} style={{ overflow: "hidden" }}>
        <Animated.View style={{ transform: [{ translateX: slideAnim }] }}>
          <View style={styles.weekRow}>
            {weekDays.map((d) => (
              <Text
                key={d}
                variant="labelSmall"
                style={[
                  styles.weekDayText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                {d}
              </Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {days.map((day) => {
              const { log, phase } = getDayStatus(day);
              const isCurrentMonth = isSameMonth(day, currentMonth);
              const isPeriodDay = log?.isPeriod;
              const inEditRange = isInEditRange(day);
              const isStart = isEditStart(day);
              const isEnd = isEditEnd(day);

              let backgroundColor: string;
              const isPredictedPeriod =
                !isPeriodDay && phase === "menstruation";
              if (inEditRange) {
                backgroundColor =
                  isStart || isEnd
                    ? cyclePhaseColors.menstruation
                    : `${cyclePhaseColors.menstruation}60`;
              } else if (isPeriodDay) {
                backgroundColor = cyclePhaseColors.menstruation;
              } else if (isPredictedPeriod) {
                backgroundColor = `${cyclePhaseColors.menstruation}90`;
              } else {
                backgroundColor = "transparent";
              }

              const textColor =
                (inEditRange && (isStart || isEnd)) || isPeriodDay
                  ? "#ffffff"
                  : inEditRange || isPredictedPeriod
                    ? "#ffffff"
                    : theme.colors.onSurface;

              let borderColor = "transparent";
              let borderWidth = 0;
              if (editMode === "idle" && isToday(day)) {
                borderColor = theme.colors.primary;
                borderWidth = 2;
              } else if (
                editMode === "idle" &&
                selectedDay &&
                isSameDay(day, selectedDay)
              ) {
                borderColor = theme.colors.secondary;
                borderWidth = 2;
              }

              // Show a phase dot for non-period phases only
              const showPhaseDot =
                !isPeriodDay && !isPredictedPeriod && !inEditRange;

              return (
                <View key={day.toISOString()} style={styles.dayWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.dayCell,
                      {
                        backgroundColor,
                        opacity: isCurrentMonth ? 1 : 0.3,
                        borderColor,
                        borderWidth,
                      },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleDayPress(day)}
                  >
                    <Text
                      variant="bodyMedium"
                      style={{ color: textColor, fontWeight: "500" }}
                    >
                      {format(day, "d")}
                    </Text>
                    {showPhaseDot && (
                      <View
                        style={[
                          styles.phaseDot,
                          { backgroundColor: cyclePhaseColors[phase] },
                        ]}
                      />
                    )}
                    {isStart && <Text style={styles.editDayLabel}>S</Text>}
                    {isEnd && <Text style={styles.editDayLabel}>E</Text>}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </Animated.View>
      </View>

      {editStart && editEnd && editMode === "selectEnd" && (
        <Card
          style={[
            styles.confirmCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Content style={{ padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 12,
              }}
            >
              <Icon
                name="calendar-check"
                size={22}
                color={cyclePhaseColors.menstruation}
              />
              <Text variant="titleSmall" style={{ fontWeight: "700", flex: 1 }}>
                Confirm Period Dates
              </Text>
            </View>
            <View style={styles.datePreviewRow}>
              <View style={styles.datePreviewItem}>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Start
                </Text>
                <Text
                  variant="titleMedium"
                  style={{
                    fontWeight: "700",
                    color: cyclePhaseColors.menstruation,
                  }}
                >
                  {format(editStart, "MMM d")}
                </Text>
              </View>
              <Icon
                name="arrow-right"
                size={20}
                color={theme.colors.onSurfaceVariant}
              />
              <View style={styles.datePreviewItem}>
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  End
                </Text>
                <Text
                  variant="titleMedium"
                  style={{
                    fontWeight: "700",
                    color: cyclePhaseColors.menstruation,
                  }}
                >
                  {format(editEnd, "MMM d")}
                </Text>
              </View>
              <View
                style={[
                  styles.datePreviewItem,
                  {
                    backgroundColor: `${cyclePhaseColors.menstruation}15`,
                    borderRadius: 8,
                    padding: 6,
                  },
                ]}
              >
                <Text
                  variant="labelSmall"
                  style={{ color: theme.colors.onSurfaceVariant }}
                >
                  Duration
                </Text>
                <Text
                  variant="titleMedium"
                  style={{
                    fontWeight: "700",
                    color: cyclePhaseColors.menstruation,
                  }}
                >
                  {differenceInDays(editEnd, editStart) + 1} days
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 12, marginTop: 14 }}>
              <Button
                mode="outlined"
                onPress={handleCancelEdit}
                style={{ flex: 1, borderRadius: 20 }}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                buttonColor={cyclePhaseColors.menstruation}
                onPress={handleSaveEdit}
                style={{ flex: 1, borderRadius: 20 }}
                icon="check"
              >
                Save
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {editMode === "idle" && selectedDay && (
        <Card
          style={[
            styles.insightCard,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Card.Content style={styles.insightCardContent}>
            {(() => {
              const getDayInCycleForDate = (date: Date) => {
                if (!settings?.lastPeriodDate) return 1;
                const lastPeriod = parseISO(settings.lastPeriodDate);
                const dayDiff = differenceInDays(date, lastPeriod);
                if (appMode === "trackPregnancy")
                  return dayDiff >= 0 ? dayDiff + 1 : 1;
                const dayInCycle = dayDiff % settings.averageCycleLength;
                const adjusted =
                  dayInCycle < 0
                    ? dayInCycle + settings.averageCycleLength
                    : dayInCycle;
                return adjusted + 1;
              };
              const dayInCycle = getDayInCycleForDate(selectedDay);
              const insight = getInsightForDay(dayInCycle, appMode);
              return (
                <>
                  <View style={styles.insightHeader}>
                    <View
                      style={[
                        styles.insightIconCircle,
                        { backgroundColor: `${theme.colors.primary}18` },
                      ]}
                    >
                      <Icon
                        name="creation"
                        size={20}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        variant="titleSmall"
                        style={{
                          color: theme.colors.onSurface,
                          fontWeight: "700",
                        }}
                      >
                        Insight for {format(selectedDay, "MMMM d")}
                      </Text>
                      <Text
                        variant="labelSmall"
                        style={{ color: theme.colors.onSurfaceVariant }}
                      >
                        Cycle Day {dayInCycle}
                      </Text>
                    </View>
                  </View>
                  <Divider style={{ marginVertical: 12, opacity: 0.3 }} />
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurface, lineHeight: 22 }}
                  >
                    {insight.summary}
                  </Text>
                  <View style={styles.insightDisclaimer}>
                    <Icon
                      name="information-outline"
                      size={12}
                      color={theme.colors.onSurfaceVariant}
                    />
                    <Text
                      variant="labelSmall"
                      style={{
                        color: theme.colors.onSurfaceVariant,
                        marginLeft: 4,
                        flex: 1,
                      }}
                    >
                      AI-generated · Not medical advice
                    </Text>
                  </View>
                </>
              );
            })()}
          </Card.Content>
        </Card>
      )}

      <Card style={styles.legendCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.legendTitle}>
            Cycle Phases
          </Text>
          <View style={styles.legendGrid}>
            {(Object.keys(cyclePhaseColors) as CyclePhase[]).map((phase) => (
              <View key={phase} style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: cyclePhaseColors[phase] },
                  ]}
                />
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    textTransform: "capitalize",
                  }}
                >
                  {phaseLabels[phase]}
                </Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2500}
          style={{ backgroundColor: "#D32F2F" }}
          action={{
            label: "OK",
            textColor: "#fff",
            onPress: () => setSnackbarVisible(false),
          }}
        >
          You can't select a future date as a period day
        </Snackbar>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 24 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  monthTitle: { fontWeight: "700" },
  editBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingLeft: 16,
    paddingVertical: 4,
    marginBottom: 12,
  },
  weekRow: { flexDirection: "row", marginBottom: 8 },
  weekDayText: { flex: 1, textAlign: "center", fontWeight: "500" },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayWrapper: { width: "14.28%", aspectRatio: 1, padding: 2 },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  dotIndicator: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    marginTop: -4,
    position: "absolute",
    bottom: 4,
  },
  phaseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
    bottom: 4,
  },
  editDayLabel: {
    color: "#fff",
    fontSize: 8,
    fontWeight: "700",
    position: "absolute",
    bottom: 2,
  },
  confirmCard: { marginTop: 16, borderRadius: 16, elevation: 0 },
  datePreviewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 8,
  },
  datePreviewItem: { alignItems: "center" },
  legendCard: { marginTop: 24 },
  legendTitle: { fontWeight: "600", marginBottom: 16 },
  legendGrid: { flexDirection: "row", flexWrap: "wrap" },
  legendItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  legendDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  insightCard: { marginTop: 20, borderRadius: 16, elevation: 0 },
  insightCardContent: { padding: 20 },
  insightHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  insightIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  insightDisclaimer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    opacity: 0.6,
  },
});
