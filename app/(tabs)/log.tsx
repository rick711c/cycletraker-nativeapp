import Icon from "@/src/components/ui/Icon";
import { format } from "date-fns";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
    Button,
    Card,
    Portal,
    Snackbar,
    Text,
    TextInput,
    useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { hapticLight, hapticSuccess } from "@/src/lib/haptics";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { addDayLogRequest, selectDayLogs } from "@/src/store/cycleSlice";
import {
    DayLog,
    FlowIntensity,
    Mood,
    PhysicalSymptom,
} from "@/src/types/cycle";

// --- Premium Colorful Flow Configuration ---
const flowOptions: { id: FlowIntensity; label: string; icon: string; color: string }[] = [
  { id: "spotting", label: "Spotting", icon: "water-outline", color: "#FF9EAE" },
  { id: "light", label: "Light", icon: "water", color: "#FF6B8B" },
  { id: "medium", label: "Medium", icon: "water-percent", color: "#FF3366" },
  { id: "heavy", label: "Heavy", icon: "waves", color: "#C10037" },
];

// --- Premium Colorful Mood Configuration ---
const moodOptions: { id: Mood; label: string; icon: string; color: string }[] = [
  { id: "happy", label: "Happy", icon: "emoticon-happy-outline", color: "#FFB549" },
  { id: "energetic", label: "Energetic", icon: "lightning-bolt", color: "#FF5E7E" },
  { id: "sensitive", label: "Sensitive", icon: "heart-outline", color: "#A076F9" },
  { id: "anxious", label: "Anxious", icon: "cloud-outline", color: "#4EA8DE" },
  { id: "sad", label: "Sad", icon: "emoticon-sad-outline", color: "#56CFE1" },
  { id: "irritable", label: "Irritable", icon: "fire", color: "#FF4747" },
];

// --- Premium Colorful Symptom Configuration ---
const symptomOptions: { id: PhysicalSymptom; label: string; icon: string; color: string }[] = [
  { id: "cramps", label: "Cramps", icon: "lightning-bolt-outline", color: "#FF2A7A" },
  { id: "headache", label: "Headache", icon: "head-flash-outline", color: "#8B5CF6" },
  { id: "bloating", label: "Bloating", icon: "balloon", color: "#F59E0B" },
  { id: "breast_tenderness", label: "Tenderness", icon: "heart-broken-outline", color: "#EC4899" },
  { id: "acne", label: "Acne", icon: "dots-circle", color: "#10B981" },
  { id: "fatigue", label: "Fatigue", icon: "bed-outline", color: "#6366F1" },
  { id: "backache", label: "Backache", icon: "bone", color: "#D97706" },
  { id: "nausea", label: "Nausea", icon: "emoticon-sick-outline", color: "#84CC16" },
];

export default function LogScreen() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const today = format(new Date(), "yyyy-MM-dd");
  const dayLogs = useAppSelector(selectDayLogs);
  const existingLog = dayLogs.find((l) => l.date === today);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [log, setLog] = useState<DayLog>(
    existingLog || {
      date: today,
      isPeriod: false,
      moods: [],
      symptoms: [],
      notes: "",
    },
  );

  const toggleMood = (mood: Mood) => {
    hapticLight();
    setLog((prev) => ({
      ...prev,
      moods: prev.moods.includes(mood)
        ? prev.moods.filter((m) => m !== mood)
        : [...prev.moods, mood],
    }));
  };

  const toggleSymptom = (symptom: PhysicalSymptom) => {
    hapticLight();
    setLog((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleSave = () => {
    hapticSuccess();
    dispatch(addDayLogRequest(log));
    setSnackbarVisible(true);
  };

  return (
    <View style={[styles.pageWrapper, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Log Today
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, fontWeight: "500" }}>
            {format(new Date(), "EEEE, MMMM d")}
          </Text>
        </View>

        {/* --- 1. FLOW SECTION --- */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <Icon icon="water" size={22} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>Flow Intensity</Text>
            </View>
            <View style={styles.gridRow}>
              {flowOptions.map((option) => {
                const isSelected = log.flowIntensity === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() =>
                      setLog((prev) => ({
                        ...prev,
                        isPeriod: true,
                        flowIntensity: prev.flowIntensity === option.id ? undefined : option.id,
                      }))
                    }
                    style={[
                      styles.optionBox,
                      {
                        width: "23%",
                        backgroundColor: isSelected ? option.color : `${option.color}15`,
                        borderColor: isSelected ? option.color : `${option.color}35`,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Icon
                      icon={option.icon}
                      size={24}
                      color={isSelected ? "#FFFFFF" : option.color}
                    />
                    <Text
                      variant="labelSmall"
                      style={[
                        styles.optionLabel,
                        { color: isSelected ? "#FFFFFF" : theme.colors.onSurface, fontWeight: isSelected ? "700" : "500" },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {/* --- 2. MOODS SECTION --- */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <Icon icon="heart-outline" size={22} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>How are you feeling?</Text>
            </View>
            <View style={styles.gridRow}>
              {moodOptions.map((option) => {
                const isSelected = log.moods.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => toggleMood(option.id)}
                    style={[
                      styles.optionBox,
                      {
                        width: "31.3%",
                        backgroundColor: isSelected ? option.color : `${option.color}12`,
                        borderColor: isSelected ? option.color : `${option.color}30`,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Icon 
                      icon={option.icon} 
                      size={26} 
                      color={isSelected ? "#FFFFFF" : option.color} 
                    />
                    <Text 
                      variant="labelSmall" 
                      style={[
                        styles.optionLabel, 
                        { color: isSelected ? "#FFFFFF" : theme.colors.onSurface, fontWeight: isSelected ? "700" : "500" }
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {/* --- 3. SYMPTOMS SECTION --- */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <Icon icon="alert-circle-outline" size={22} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>Symptoms</Text>
            </View>
            <View style={styles.gridRow}>
              {symptomOptions.map((option) => {
                const isSelected = log.symptoms.includes(option.id);
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => toggleSymptom(option.id)}
                    style={[
                      styles.optionBox,
                      {
                        width: "23%",
                        backgroundColor: isSelected ? option.color : `${option.color}12`,
                        borderColor: isSelected ? option.color : `${option.color}30`,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Icon 
                      icon={option.icon} 
                      size={24} 
                      color={isSelected ? "#FFFFFF" : option.color} 
                    />
                    <Text
                      variant="labelSmall"
                      style={[
                        styles.optionLabel,
                        { 
                          fontSize: 10, 
                          color: isSelected ? "#FFFFFF" : theme.colors.onSurface, 
                          fontWeight: isSelected ? "700" : "500" 
                        }
                      ]}
                      numberOfLines={1}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {/* --- 4. NOTES SECTION --- */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.sectionHeader}>
              <Icon icon="notebook-outline" size={22} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>Notes</Text>
            </View>
            <TextInput
              mode="outlined"
              placeholder="How was your day? Any other symptoms..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              value={log.notes}
              onChangeText={(text) => setLog((prev) => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={4}
              outlineStyle={{ borderRadius: 16, borderColor: "rgba(255,255,255,0.1)" }}
              style={{ backgroundColor: "rgba(255,255,255,0.03)", color: "#FFFFFF" }}
            />
          </Card.Content>
        </Card>

        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            action={{ label: "OK", onPress: () => setSnackbarVisible(false) }}
          >
            Log saved! Your daily log has been recorded.
          </Snackbar>
        </Portal>
      </ScrollView>

      <View
        style={[
          styles.floatingBar,
          {
            backgroundColor: theme.colors.background,
            paddingBottom: Math.max(insets.bottom, 16),
          },
        ]}
      >
        <Button
          mode="contained"
          onPress={handleSave}
          icon="check"
          contentStyle={{ height: 54 }}
          labelStyle={{ fontSize: 16, fontWeight: "700", letterSpacing: 0.5 }}
          style={styles.saveButton}
        >
          Save Log
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 110 },
  pageWrapper: { flex: 1, position: "relative" },
  header: { marginBottom: 20 },
  headerTitle: { fontWeight: "800", letterSpacing: -0.5 },
  card: { marginBottom: 16, elevation: 0, backgroundColor: "transparent" },
  cardContent: { paddingHorizontal: 0, paddingVertical: 4 },
  sectionHeader: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 14, 
    gap: 8,
    width: "100%",
  },
  // FIXED: Replaced flexShrink with flex: 1 to grant text the remaining space and entirely ban word wrapping
  sectionTitle: { 
    fontWeight: "700", 
    letterSpacing: -0.2,
    flex: 1, 
  },
  gridRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "flex-start" },
  optionBox: { 
    alignItems: "center", 
    justifyContent: "center", 
    paddingVertical: 14, 
    paddingHorizontal: 4, 
    borderRadius: 18, 
    marginBottom: 4,
  },
  optionLabel: { marginTop: 8, textAlign: "center" },
  saveButton: { borderRadius: 16 },
  floatingBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
});