import { AnimeGrasslandCanvas } from "@/src/components/cycle/AnimeGrasslandCanvas";
import { QuickActions } from "@/src/components/cycle/QuickActions";
import { SmartDailyInsight } from "@/src/components/cycle/SmartDailyInsight";
import { useAppSelector } from "@/src/store";
import { selectCycleStats, selectSettings } from "@/src/store/cycleSlice";
import { AppMode } from "@/src/types/insight";
import React, { useCallback, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

export default function HomeScreen() {
  const stats = useAppSelector(selectCycleStats);
  const settings = useAppSelector(selectSettings);
  const theme = useTheme();
  const [scrollEnabled, setScrollEnabled] = useState(true);

  const appMode: AppMode =
    settings.goal === "conceive"
      ? "tryToConceive"
      : settings.goal === "pregnancy"
        ? "trackPregnancy"
        : "trackCycle";

  // Fallback safe assignment for the next period countdown string or date tracking
  const nextPeriodTarget = stats.nextPeriodDate || "";

  const handleDragStateChange = useCallback((isDragging: boolean) => {
    setScrollEnabled(!isDragging);
  }, []);

  return (
    <View style={[styles.viewportCanvas, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}
        scrollEnabled={scrollEnabled}
      >
        {/* 1. Unified upper viewport canvas (always dark hero) */}
        <AnimeGrasslandCanvas
          dayInCycle={stats.dayInCycle}
          cycleLength={stats.averageCycleLength}
          currentPhase={stats.currentPhase}
          periodLength={stats.averagePeriodLength}
          nextPeriodDate={nextPeriodTarget}
          onPuppyDragStateChange={handleDragStateChange}
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
  },
  scrollView: { 
    flex: 1, 
  },
  container: { 
    paddingBottom: 32,
  },
  insightContainer: { 
    marginTop: 24,
  },
});