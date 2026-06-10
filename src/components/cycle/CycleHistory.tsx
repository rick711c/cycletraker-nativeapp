import { useAppSelector } from "@/src/store";
import { selectCycles } from "@/src/store/cycleSlice";
import { cyclePhaseColors } from "@/src/theme/muiTheme";
import { CycleData } from "@/src/types/cycle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { differenceInDays, format, parseISO } from "date-fns";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

function getPeriodDuration(cycle: CycleData) {
  if (!cycle.endDate) return null;
  return (
    differenceInDays(parseISO(cycle.endDate), parseISO(cycle.startDate)) + 1
  );
}

export function CycleHistory() {
  const theme = useTheme();
  const cycles = useAppSelector(selectCycles);
  const cycleHistory = [...cycles].reverse();

  if (cycleHistory.length === 0) {
    return (
      <View style={styles.emptyState}>
        <MaterialCommunityIcons
          name="calendar-blank-outline"
          size={40}
          color={theme.colors.onSurfaceVariant}
        />
        <Text
          variant="bodyMedium"
          style={{
            color: theme.colors.onSurfaceVariant,
            marginTop: 12,
            textAlign: "center",
          }}
        >
          No cycles recorded yet.{"\n"}Start tracking to see your history!
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      {cycleHistory.map((cycle, index) => {
        const isActive = !cycle.endDate || !cycle.length;
        const periodDuration = getPeriodDuration(cycle);
        const cycleNumber = cycleHistory.length - index;

        return (
          <View
            key={cycle.startDate}
            style={[
              styles.card,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <View style={styles.titleRow}>
              <Text
                variant="bodyLarge"
                style={{
                  color: theme.colors.onSurface,
                  fontWeight: "600",
                  flex: 1,
                }}
              >
                Cycle {cycleNumber}
              </Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isActive
                      ? "#4CAF50"
                      : theme.colors.primary,
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {isActive ? "Active" : "Completed"}
                </Text>
              </View>
            </View>
            <Text
              variant="bodyMedium"
              style={{ color: theme.colors.onSurfaceVariant, marginTop: 4 }}
            >
              {format(parseISO(cycle.startDate), "MMM d")}
              {cycle.endDate
                ? ` – ${format(parseISO(cycle.endDate), "MMM d, yyyy")}`
                : " – Present"}
            </Text>
            <View style={styles.statsRow}>
              {cycle.length != null && (
                <View style={styles.stat}>
                  <MaterialCommunityIcons
                    name="swap-horizontal"
                    size={13}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text
                    variant="labelSmall"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginLeft: 3,
                    }}
                  >
                    {cycle.length}d cycle
                  </Text>
                </View>
              )}
              {periodDuration != null && (
                <View style={styles.stat}>
                  <MaterialCommunityIcons
                    name="water-outline"
                    size={13}
                    color={cyclePhaseColors.menstruation}
                  />
                  <Text
                    variant="labelSmall"
                    style={{
                      color: theme.colors.onSurfaceVariant,
                      marginLeft: 3,
                    }}
                  >
                    {periodDuration}d period
                  </Text>
                </View>
              )}
              {isActive && !cycle.length && (
                <View style={styles.stat}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={13}
                    color="#4CAF50"
                  />
                  <Text
                    variant="labelSmall"
                    style={{ color: "#4CAF50", marginLeft: 3 }}
                  >
                    In progress
                  </Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { paddingHorizontal: 16, gap: 10 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 56,
    paddingHorizontal: 32,
  },
  card: { borderRadius: 14, padding: 16 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: 16, marginTop: 10 },
  stat: { flexDirection: "row", alignItems: "center" },
});
