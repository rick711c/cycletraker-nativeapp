import Icon from "@/src/components/ui/Icon";
import { hapticLight, hapticSuccess } from "@/src/lib/haptics";
import { useAppDispatch } from "@/src/store";
import { setOnboarded, updateSettingsRequest } from "@/src/store/cycleSlice";
import { format, subDays } from "date-fns";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView, StyleSheet, TouchableOpacity, View, Image,
} from "react-native";
import { Calendar } from "react-native-calendars";
import {
  Button,
  Card,
  IconButton,
  ProgressBar,
  Text,
  useTheme,
} from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Step = "welcome" | "lastPeriod" | "cycleLength" | "periodLength" | "goal";

interface OnboardingData {
  lastPeriodDate: string;
  averageCycleLength: number;
  averagePeriodLength: number;
  goal: "track" | "conceive" | "pregnancy";
}

export default function OnboardingScreen() {
  const router = useRouter();
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>("welcome");
  const [showCalendar, setShowCalendar] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    lastPeriodDate: format(subDays(new Date(), 14), "yyyy-MM-dd"),
    averageCycleLength: 28,
    averagePeriodLength: 5,
    goal: "track",
  });

  const handleComplete = () => {
    hapticSuccess();
    dispatch(updateSettingsRequest(data));
    dispatch(setOnboarded(true));
    router.replace("/(tabs)");
  };

  const steps: Step[] = [
    "welcome",
    "lastPeriod",
    "cycleLength",
    "periodLength",
    "goal",
  ];
  const currentIndex = steps.indexOf(step);
  const progressValue = currentIndex / (steps.length - 1);

  const goNext = () => {
    hapticLight();
    if (currentIndex < steps.length - 1) setStep(steps[currentIndex + 1]);
    else handleComplete();
  };

  const goBack = () => {
    hapticLight();
    if (currentIndex > 0) setStep(steps[currentIndex - 1]);
  };

  const goals = [
    {
      id: "track",
      label: "Track my cycle",
      icon: "calendar-heart",
      description: "Understand your body better",
    },
    {
      id: "conceive",
      label: "Try to conceive",
      icon: "baby-carriage",
      description: "Optimize fertility window",
    },
    {
      id: "pregnancy",
      label: "Track pregnancy",
      icon: "human-pregnant",
      description: "Monitor your journey",
    },
  ] as const;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={["top", "bottom"]}
    >

      {/* Header with image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/images/hero-flowers.jpg")}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Overlay to fade image */}
        <View style={styles.imageOverlay} />

        {/* Brand Overlay */}
        <View style={styles.brandOverlay}>
          <View style={styles.brandContent}>
            <Icon icon="flower" size={32} color={theme.colors.primary} />
            <Text variant="headlineMedium" style={styles.brandText}>
              Flora
            </Text>
          </View>
        </View>
      </View>
      {step !== "welcome" && (
        <View style={styles.progressContainer}>
          <ProgressBar
            progress={progressValue}
            color={theme.colors.primary}
            style={styles.progressBar}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === "welcome" && (
          <View style={styles.centerContent}>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome to Flora
            </Text>
            <Text
              variant="bodyLarge"
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Your personal cycle companion. Let's set up your profile to give
              you accurate predictions.
            </Text>
            <Button
              mode="contained"
              onPress={goNext}
              contentStyle={[
                styles.buttonContent,
                { flexDirection: "row-reverse" },
              ]}
              style={styles.fullWidthButton}
              icon="chevron-right"
            >
              Get Started
            </Button>
          </View>
        )}

        {step === "lastPeriod" && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={styles.title}>
              When did your last period start?
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              This helps us predict your cycle accurately.
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowCalendar((prev) => !prev)}
              style={[
                styles.dateField,
                {
                  borderColor: showCalendar
                    ? theme.colors.primary
                    : theme.colors.outline,
                  backgroundColor: theme.colors.surface,
                },
              ]}
            >
              <Text
                style={{
                  color: theme.colors.onSurfaceVariant,
                  fontSize: 12,
                  marginBottom: 2,
                }}
              >
                Last period start date
              </Text>
              <View style={styles.dateFieldRow}>
                <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>
                  {data.lastPeriodDate}
                </Text>
                <Icon
                  name="calendar-month"
                  size={22}
                  color={theme.colors.primary}
                />
              </View>
            </TouchableOpacity>

            {showCalendar && (
              <View
                style={[
                  styles.inlineCalendar,
                  {
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.outline,
                  },
                ]}
              >
                <Calendar
                  current={data.lastPeriodDate}
                  maxDate={new Date().toISOString().split("T")[0]}
                  onDayPress={(day) => {
                    setData({ ...data, lastPeriodDate: day.dateString });
                    setShowCalendar(false);
                  }}
                  markedDates={{
                    [data.lastPeriodDate]: {
                      selected: true,
                      selectedColor: theme.colors.primary,
                    },
                  }}
                  theme={{
                    backgroundColor: theme.colors.surface,
                    calendarBackground: theme.colors.surface,
                    textSectionTitleColor: theme.colors.onSurfaceVariant,
                    selectedDayBackgroundColor: theme.colors.primary,
                    selectedDayTextColor: "#fff",
                    todayTextColor: theme.colors.primary,
                    dayTextColor: theme.colors.onSurface,
                    arrowColor: theme.colors.primary,
                    monthTextColor: theme.colors.onSurface,
                    textDisabledColor: theme.colors.outlineVariant,
                  }}
                />
              </View>
            )}
          </View>
        )}

        {step === "cycleLength" && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={styles.title}>
              Average cycle length?
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              From the first day of one period to the first day of the next.
            </Text>
            <View style={styles.counterContainer}>
              <View style={styles.counterRow}>
                <IconButton
                  mode="outlined"
                  icon="minus"
                  onPress={() =>
                    setData({
                      ...data,
                      averageCycleLength: Math.max(
                        21,
                        data.averageCycleLength - 1,
                      ),
                    })
                  }
                />
                <View style={styles.counterText}>
                  <Text
                    variant="displayMedium"
                    style={{ color: theme.colors.primary, fontWeight: "bold" }}
                  >
                    {data.averageCycleLength}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    days
                  </Text>
                </View>
                <IconButton
                  mode="outlined"
                  icon="plus"
                  onPress={() =>
                    setData({
                      ...data,
                      averageCycleLength: Math.min(
                        40,
                        data.averageCycleLength + 1,
                      ),
                    })
                  }
                />
              </View>
              <Text
                variant="bodySmall"
                style={[
                  styles.helperText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Most cycles are between 21-35 days
              </Text>
            </View>
          </View>
        )}

        {step === "periodLength" && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={styles.title}>
              How long does your period last?
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              Average number of days you experience bleeding.
            </Text>
            <View style={styles.counterContainer}>
              <View style={styles.counterRow}>
                <IconButton
                  mode="outlined"
                  icon="minus"
                  onPress={() =>
                    setData({
                      ...data,
                      averagePeriodLength: Math.max(
                        2,
                        data.averagePeriodLength - 1,
                      ),
                    })
                  }
                />
                <View style={styles.counterText}>
                  <Text
                    variant="displayMedium"
                    style={{ color: theme.colors.primary, fontWeight: "bold" }}
                  >
                    {data.averagePeriodLength}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    days
                  </Text>
                </View>
                <IconButton
                  mode="outlined"
                  icon="plus"
                  onPress={() =>
                    setData({
                      ...data,
                      averagePeriodLength: Math.min(
                        10,
                        data.averagePeriodLength + 1,
                      ),
                    })
                  }
                />
              </View>
              <Text
                variant="bodySmall"
                style={[
                  styles.helperText,
                  { color: theme.colors.onSurfaceVariant },
                ]}
              >
                Typically between 3-7 days
              </Text>
            </View>
          </View>
        )}

        {step === "goal" && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={styles.title}>
              What's your goal?
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.subtitle,
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              We'll personalize your experience based on your needs.
            </Text>
            <View style={styles.goalsContainer}>
              {goals.map((goal) => {
                const isSelected = data.goal === goal.id;
                return (
                  <Card
                    key={goal.id}
                    onPress={() => setData({ ...data, goal: goal.id as any })}
                    style={[
                      styles.goalCard,
                      {
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.outlineVariant,
                        borderWidth: 2,
                        backgroundColor: isSelected
                          ? theme.colors.primaryContainer + "20"
                          : theme.colors.surface,
                      },
                    ]}
                  >
                    <Card.Content style={styles.goalContent}>
                      <Icon
                        name={goal.icon}
                        size={32}
                        color={
                          isSelected
                            ? theme.colors.primary
                            : theme.colors.onSurfaceVariant
                        }
                      />
                      <View style={styles.goalText}>
                        <Text
                          variant="titleMedium"
                          style={{ fontWeight: "600" }}
                        >
                          {goal.label}
                        </Text>
                        <Text
                          variant="bodySmall"
                          style={{ color: theme.colors.onSurfaceVariant }}
                        >
                          {goal.description}
                        </Text>
                      </View>
                    </Card.Content>
                  </Card>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {step !== "welcome" && (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom + 16, 32) },
          ]}
        >
          <Button
            mode="outlined"
            onPress={goBack}
            style={styles.footerButton}
            contentStyle={styles.footerButtonContent}
            icon="chevron-left"
          >
            Back
          </Button>
          <Button
            mode="contained"
            onPress={goNext}
            style={styles.footerButton}
            icon={step === "goal" ? undefined : "chevron-right"}
            contentStyle={[
              styles.footerButtonContent,
              { flexDirection: step === "goal" ? "row" : "row-reverse" },
            ]}
          >
            {step === "goal" ? "Complete" : "Next"}
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  imageContainer: {
    height: 192,
    position: "relative",
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(240, 240, 255, 0.2)",
  },
  brandOverlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  brandContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  brandText: {
    fontWeight: "bold",
  },
  progressContainer: { paddingHorizontal: 24, paddingVertical: 16 },
  progressBar: { height: 6, borderRadius: 3 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 16 },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  stepContent: { flex: 1 },
  title: { fontWeight: "bold", marginBottom: 8, textAlign: "center" },
  subtitle: { marginBottom: 24, textAlign: "center" },
  buttonContent: { height: 48 },
  fullWidthButton: { width: "100%", marginTop: 24 },
  counterContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  counterRow: { flexDirection: "row", alignItems: "center", gap: 24 },
  counterText: { alignItems: "center", minWidth: 80 },
  helperText: { marginTop: 24 },
  goalsContainer: { gap: 12 },
  goalCard: { marginBottom: 8 },
  goalContent: { flexDirection: "row", alignItems: "center", gap: 16 },
  goalText: { flex: 1 },
  footer: { flexDirection: "row", padding: 16, paddingBottom: 32, gap: 12 },
  footerButton: { flex: 1, marginBottom: 24 },
  footerButtonContent: { height: 52, paddingHorizontal: 8 },
  dateField: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 4,
  },
  dateFieldRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  inlineCalendar: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 4,
  },
});
