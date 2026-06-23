import { AnimeGrasslandCanvas } from "@/src/components/cycle/AnimeGrasslandCanvas";
import { QuickActions } from "@/src/components/cycle/QuickActions";
import { SmartDailyInsight } from "@/src/components/cycle/SmartDailyInsight";
import { UpcomingEvents } from "@/src/components/cycle/UpcomingEvents";
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

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      bounces={false}
    >
      {/* 1. Unified upper viewport canvas
        Houses the brand logo, live date tracking, anime grassland scenery, 
        the animated white cat, and the core progress data ring.
      */}
      <AnimeGrasslandCanvas
        dayInCycle={stats.dayInCycle}
        cycleLength={stats.averageCycleLength}
        currentPhase={stats.currentPhase}
        periodLength={stats.averagePeriodLength}
      />

      {/* 2. Upgraded premium pill-shaped interaction layer */}
      <QuickActions />

      {/* 3. Cycle information and insight timelines */}
      <UpcomingEvents stats={stats} />

      <View style={styles.insightContainer}>
        <SmartDailyInsight dayInCycle={stats.dayInCycle} appMode={appMode} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: { 
    flex: 1, 
    backgroundColor: "#000000", // Keeps a pure black background canvas
  },
  container: { 
    paddingBottom: 32,
  },
  insightContainer: { 
    marginTop: 24,
  },
});