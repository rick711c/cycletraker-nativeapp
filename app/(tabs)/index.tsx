import { CycleRing } from "@/src/components/cycle/CycleRing";
import { QuickActions } from "@/src/components/cycle/QuickActions";
import { SmartDailyInsight } from "@/src/components/cycle/SmartDailyInsight";
import { UpcomingEvents } from "@/src/components/cycle/UpcomingEvents";
import Icon from "@/src/components/ui/Icon";
import { useAppSelector } from "@/src/store";
import { selectCycleStats, selectSettings } from "@/src/store/cycleSlice";
import { AppMode } from "@/src/types/insight";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const theme = useTheme();
  const stats = useAppSelector(selectCycleStats);
  const settings = useAppSelector(selectSettings);
  const appMode: AppMode =
    settings.goal === "conceive"
      ? "tryToConceive"
      : settings.goal === "pregnancy"
        ? "trackPregnancy"
        : "trackCycle";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Icon icon="flower" size={28} color={theme.colors.primary} />
          <Text variant="headlineSmall" style={styles.brandText}>
            Flora
          </Text>
        </View>
        <View style={styles.dateContainer}>
          <Text
            variant="bodySmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            Today
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.dateText, { color: theme.colors.onSurface }]}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
      </View>

      <View style={styles.sectionPadding}>
        <CycleRing
          dayInCycle={stats.dayInCycle}
          cycleLength={stats.averageCycleLength}
          currentPhase={stats.currentPhase}
          periodLength={stats.averagePeriodLength}
        />
      </View>

      <QuickActions />
      <UpcomingEvents stats={stats} />

      <View style={styles.insightContainer}>
        <SmartDailyInsight dayInCycle={stats.dayInCycle} appMode={appMode} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingBottom: 24 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandText: { fontWeight: "700" },
  dateContainer: { alignItems: "flex-end" },
  dateText: { fontWeight: "500" },
  sectionPadding: { paddingVertical: 24 },
  insightContainer: { marginTop: 24 },
});
