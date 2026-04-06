import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Card, Button, TextInput, useTheme, Snackbar, Portal } from 'react-native-paper';
import Icon from '../components/ui/Icon';
import { format } from 'date-fns';
import { MobileLayout } from '../components/layout/MobileLayout';
import { useAppSelector, useAppDispatch } from '../store';
import { selectDayLogs, addDayLogRequest } from '../store/cycleSlice';
import { FlowIntensity, Mood, PhysicalSymptom, DayLog } from '../types/cycle';


// --- Constants ---

const flowOptions: { id: FlowIntensity; label: string; icon: string }[] = [
  { id: 'spotting', label: 'Spotting', icon: 'water-outline' }, // MIcon equivalents
  { id: 'light', label: 'Light', icon: 'water' },
  { id: 'medium', label: 'Medium', icon: 'water-percent' },
  { id: 'heavy', label: 'Heavy', icon: 'waves' },
];

const moodOptions: { id: Mood; label: string; emoji: string }[] = [
  { id: 'happy', label: 'Happy', emoji: '😊' },
  { id: 'energetic', label: 'Energetic', emoji: '⚡' },
  { id: 'sensitive', label: 'Sensitive', emoji: '🥺' },
  { id: 'anxious', label: 'Anxious', emoji: '😰' },
  { id: 'sad', label: 'Sad', emoji: '😢' },
  { id: 'irritable', label: 'Irritable', emoji: '😤' },
];

const symptomOptions: { id: PhysicalSymptom; label: string; emoji: string }[] = [
  { id: 'cramps', label: 'Cramps', emoji: '🤕' },
  { id: 'headache', label: 'Headache', emoji: '🤯' },
  { id: 'bloating', label: 'Bloating', emoji: '🎈' },
  { id: 'breast_tenderness', label: 'Tenderness', emoji: '💗' }, // Shortened label for mobile
  { id: 'acne', label: 'Acne', emoji: '😖' },
  { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { id: 'backache', label: 'Backache', emoji: '🦴' },
  { id: 'nausea', label: 'Nausea', emoji: '🤢' },
];

export default function LogPage() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const today = format(new Date(), 'yyyy-MM-dd');
  const dayLogs = useAppSelector(selectDayLogs);
  const existingLog = dayLogs.find(l => l.date === today);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const [log, setLog] = useState<DayLog>(
    existingLog || {
      date: today,
      isPeriod: false,
      moods: [],
      symptoms: [],
      notes: '',
    }
  );

  const toggleMood = (mood: Mood) => {
    setLog((prev) => ({
      ...prev,
      moods: prev.moods.includes(mood)
        ? prev.moods.filter((m) => m !== mood)
        : [...prev.moods, mood],
    }));
  };

  const toggleSymptom = (symptom: PhysicalSymptom) => {
    setLog((prev) => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter((s) => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  const handleSave = () => {
    dispatch(addDayLogRequest(log));
    setSnackbarVisible(true);
  };

  return (
    <MobileLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Log Today
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {format(new Date(), 'EEEE, MMMM d')}
          </Text>
        </View>

        {/* Flow Section */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Icon icon="water" size={20} color={theme.colors.primary} />
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Flow
              </Text>
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
                        backgroundColor: isSelected ? theme.colors.primary : theme.colors.surfaceVariant,
                        width: '23%', // ~1/4 width with gap
                      }
                    ]}
                  >
                    {/* Using Icon for flow since standard emojis vary by platform */}
                    <Icon 
                      source={option.icon} 
                      size={24} 
                      color={isSelected ? theme.colors.onPrimary : theme.colors.onSurface} 
                    />
                    <Text
                      variant="labelSmall"
                      style={[
                        styles.optionLabel,
                        { color: isSelected ? theme.colors.onPrimary : theme.colors.onSurface }
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

        {/* Mood Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              How are you feeling?
            </Text>
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
                        backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                        borderColor: theme.colors.primary,
                        borderWidth: isSelected ? 2 : 0,
                        width: '31%', // ~1/3 width
                      }
                    ]}
                  >
                    <Text style={styles.emoji}>{option.emoji}</Text>
                    <Text variant="labelSmall" style={styles.optionLabel}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Card.Content>
        </Card>

        {/* Symptoms Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Symptoms
            </Text>
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
                        backgroundColor: isSelected ? theme.colors.primaryContainer : theme.colors.surfaceVariant,
                        borderColor: theme.colors.primary,
                        borderWidth: isSelected ? 2 : 0,
                        width: '23%', // ~1/4 width
                      }
                    ]}
                  >
                    <Text style={styles.emoji}>{option.emoji}</Text>
                    <Text
                      variant="labelSmall"
                      style={[styles.optionLabel, { fontSize: 10 }]}
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

        {/* Notes Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notes
            </Text>
            <TextInput
              mode="outlined"
              placeholder="How was your day? Any other symptoms..."
              value={log.notes}
              onChangeText={(text) => setLog((prev) => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={4}
              style={{ backgroundColor: theme.colors.surface }}
            />
          </Card.Content>
        </Card>

        {/* Save Button */}
        <Button
          mode="contained"
          onPress={handleSave}
          icon="check"
          contentStyle={{ height: 56 }}
          labelStyle={{ fontSize: 18, fontWeight: '600' }}
          style={styles.saveButton}
        >
          Save Log
        </Button>

        {/* Snackbar for feedback */}
        <Portal>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            action={{
              label: 'OK',
              onPress: () => setSnackbarVisible(false),
            }}
          >
            Log saved! Your daily log has been recorded.
          </Snackbar>
        </Portal>
      </ScrollView>
    </MobileLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontWeight: '700',
  },
  card: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 16,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
  },
  optionBox: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    marginTop: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 8,
    borderRadius: 8,
  },
});