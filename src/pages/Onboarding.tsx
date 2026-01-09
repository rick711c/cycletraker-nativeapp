import React, { useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Button, IconButton, ProgressBar, Card, TextInput, useTheme, Icon } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { format, subDays } from 'date-fns';
import { useCycleStore } from '@/hooks/useCycleStore';

// If this asset import fails in your RN setup, replace with: { uri: 'https://placeholder.url/image.jpg' }
// or require('../assets/hero-flowers.png')
import heroFlowers from '@/assets/hero-flowers.png';

type Step = 'welcome' | 'lastPeriod' | 'cycleLength' | 'periodLength' | 'goal';

interface OnboardingData {
  lastPeriodDate: string;
  averageCycleLength: number;
  averagePeriodLength: number;
  goal: 'track' | 'conceive' | 'pregnancy';
}

export default function Onboarding() {
  const navigation = useNavigation();
  const theme = useTheme();
  const { setOnboarded, updateSettings } = useCycleStore();
  
  const [step, setStep] = useState<Step>('welcome');
  const [data, setData] = useState<OnboardingData>({
    lastPeriodDate: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
    averageCycleLength: 28,
    averagePeriodLength: 5,
    goal: 'track',
  });

  const handleComplete = () => {
    updateSettings(data);
    setOnboarded(true);
    // Reset navigation stack to Home to prevent going back to Onboarding
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' as never }],
    });
  };

  const steps: Step[] = ['welcome', 'lastPeriod', 'cycleLength', 'periodLength', 'goal'];
  const currentIndex = steps.indexOf(step);
  // Progress value in Paper is 0 to 1
  const progressValue = currentIndex / (steps.length - 1);

  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      setStep(steps[currentIndex + 1]);
    } else {
      handleComplete();
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  const goals = [
    { id: 'track', label: 'Track my cycle', emoji: '📅', description: 'Understand your body better' },
    { id: 'conceive', label: 'Try to conceive', emoji: '👶', description: 'Optimize fertility window' },
    { id: 'pregnancy', label: 'Track pregnancy', emoji: '🤰', description: 'Monitor your journey' },
  ] as const;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header with image */}
      <View style={styles.imageContainer}>
        <Image
          source={heroFlowers} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        {/* Overlay to fade image */}
        <View style={styles.imageOverlay} />
        
        {/* Brand Overlay */}
        <View style={styles.brandOverlay}>
          <View style={styles.brandContent}>
            <Icon source="flower" size={32} color={theme.colors.primary} />
            <Text variant="headlineMedium" style={styles.brandText}>
              Flora
            </Text>
          </View>
        </View>
      </View>

      {/* Progress */}
      {step !== 'welcome' && (
        <View style={styles.progressContainer}>
          <ProgressBar progress={progressValue} color={theme.colors.primary} style={styles.progressBar} />
        </View>
      )}

      {/* Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {step === 'welcome' && (
          <View style={styles.centerContent}>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome to Flora
            </Text>
            <Text variant="bodyLarge" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Your personal cycle companion. Let's set up your profile to give you accurate predictions.
            </Text>
            <Button
              mode="contained"
              onPress={goNext}
              contentStyle={styles.buttonContent}
              style={styles.fullWidthButton}
              icon="chevron-right"
              contentStyle={{ flexDirection: 'row-reverse' }} // Put icon on right
            >
              Get Started
            </Button>
          </View>
        )}

        {step === 'lastPeriod' && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={styles.title}>
              When did your last period start?
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              This helps us predict your cycle accurately.
            </Text>
            {/* Note: In a real app, use a dedicated DatePicker library here */}
            <TextInput
              mode="outlined"
              label="Last period start date"
              placeholder="YYYY-MM-DD"
              value={data.lastPeriodDate}
              onChangeText={(text) => setData({ ...data, lastPeriodDate: text })}
              style={styles.input}
              right={<TextInput.Icon icon="calendar" />}
            />
          </View>
        )}

        {step === 'cycleLength' && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={styles.title}>
              Average cycle length?
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              From the first day of one period to the first day of the next.
            </Text>
            
            <View style={styles.counterContainer}>
              <View style={styles.counterRow}>
                <IconButton
                  mode="outlined"
                  icon="minus"
                  onPress={() =>
                    setData({ ...data, averageCycleLength: Math.max(21, data.averageCycleLength - 1) })
                  }
                />
                <View style={styles.counterText}>
                  <Text variant="displayMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    {data.averageCycleLength}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    days
                  </Text>
                </View>
                <IconButton
                  mode="outlined"
                  icon="plus"
                  onPress={() =>
                    setData({ ...data, averageCycleLength: Math.min(40, data.averageCycleLength + 1) })
                  }
                />
              </View>
              <Text variant="bodySmall" style={[styles.helperText, { color: theme.colors.onSurfaceVariant }]}>
                Most cycles are between 21-35 days
              </Text>
            </View>
          </View>
        )}

        {step === 'periodLength' && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={styles.title}>
              How long does your period last?
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Average number of days you experience bleeding.
            </Text>
            
            <View style={styles.counterContainer}>
              <View style={styles.counterRow}>
                <IconButton
                  mode="outlined"
                  icon="minus"
                  onPress={() =>
                    setData({ ...data, averagePeriodLength: Math.max(2, data.averagePeriodLength - 1) })
                  }
                />
                <View style={styles.counterText}>
                  <Text variant="displayMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>
                    {data.averagePeriodLength}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    days
                  </Text>
                </View>
                <IconButton
                  mode="outlined"
                  icon="plus"
                  onPress={() =>
                    setData({ ...data, averagePeriodLength: Math.min(10, data.averagePeriodLength + 1) })
                  }
                />
              </View>
              <Text variant="bodySmall" style={[styles.helperText, { color: theme.colors.onSurfaceVariant }]}>
                Typically between 3-7 days
              </Text>
            </View>
          </View>
        )}

        {step === 'goal' && (
          <View style={styles.stepContent}>
            <Text variant="headlineSmall" style={styles.title}>
              What's your goal?
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
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
                        borderColor: isSelected ? theme.colors.primary : theme.colors.outlineVariant,
                        borderWidth: 2,
                        backgroundColor: isSelected ? theme.colors.primaryContainer + '20' : theme.colors.surface, // Mock alpha
                      }
                    ]}
                  >
                    <Card.Content style={styles.goalContent}>
                      <Text style={styles.goalEmoji}>{goal.emoji}</Text>
                      <View style={styles.goalText}>
                        <Text variant="titleMedium" style={{ fontWeight: '600' }}>
                          {goal.label}
                        </Text>
                        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
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

      {/* Footer Navigation */}
      {step !== 'welcome' && (
        <View style={styles.footer}>
          <Button 
            mode="outlined" 
            onPress={goBack} 
            style={styles.footerButton}
            icon="chevron-left"
          >
            Back
          </Button>
          <Button 
            mode="contained" 
            onPress={goNext} 
            style={styles.footerButton}
            icon={step === 'goal' ? undefined : "chevron-right"}
            contentStyle={{ flexDirection: step === 'goal' ? 'row' : 'row-reverse' }}
          >
            {step === 'goal' ? 'Complete' : 'Next'}
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 192,
    position: 'relative',
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(240, 240, 255, 0.2)', // Light tint to match web gradient
  },
  brandOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  brandContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandText: {
    fontWeight: 'bold',
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  stepContent: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center', // Default for welcome, override for others? 
                        // Actually web uses left align for steps, center for welcome.
  },
  subtitle: {
    marginBottom: 24,
    textAlign: 'center', // Same note as title
  },
  buttonContent: {
    height: 48,
  },
  fullWidthButton: {
    width: '100%',
    marginTop: 24,
  },
  input: {
    backgroundColor: 'transparent',
  },
  counterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  counterText: {
    alignItems: 'center',
    minWidth: 80,
  },
  helperText: {
    marginTop: 24,
  },
  goalsContainer: {
    gap: 12,
  },
  goalCard: {
    marginBottom: 8,
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  goalEmoji: {
    fontSize: 32,
  },
  goalText: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  footerButton: {
    flex: 1,
  },
});