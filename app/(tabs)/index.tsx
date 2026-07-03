import { AnimeGrasslandCanvas } from "@/src/components/cycle/AnimeGrasslandCanvas";
import { QuickActions } from "@/src/components/cycle/QuickActions";
import { SmartDailyInsight } from "@/src/components/cycle/SmartDailyInsight";
import { useAppSelector } from "@/src/store";
import { selectCycleStats, selectSettings } from "@/src/store/cycleSlice";
import { AppMode } from "@/src/types/insight";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function HomeScreen() {
  const stats = useAppSelector(selectCycleStats);
  const settings = useAppSelector(selectSettings);

  const appMode: AppMode =
    settings.goal === "conceive"
      ? "tryToConceive"
      : settings.goal === "pregnancy"
        ? "trackPregnancy"
        : "trackCycle";

  // Fallback safe assignment for the next period countdown string or date tracking
  const nextPeriodTarget = stats.nextPeriodDate || "";

  return (
    <View style={styles.viewportCanvas}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Unified upper viewport canvas */}
        <AnimeGrasslandCanvas
          dayInCycle={stats.dayInCycle}
          cycleLength={stats.averageCycleLength}
          currentPhase={stats.currentPhase}
          periodLength={stats.averagePeriodLength}
          nextPeriodDate={nextPeriodTarget}
        />

        {/* 2. Self-contained action buttons */}
        <QuickActions />

        {/* 3. Cycle insight dashboard feeds */}
        <View style={styles.insightContainer}>
          <SmartDailyInsight dayInCycle={stats.dayInCycle} appMode={appMode} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  viewportCanvas: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollView: { 
    flex: 1, 
    backgroundColor: "#000000", 
  },
  container: { 
    paddingBottom: 32,
  },
  insightContainer: { 
    marginTop: 24,
    paddingHorizontal: 16,
  },
});