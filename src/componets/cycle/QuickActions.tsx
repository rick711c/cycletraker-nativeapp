import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, Icon, useTheme } from 'react-native-paper';
import { format } from 'date-fns';
import { useCycleStore } from '@/hooks/useCycleStore';

export function QuickActions() {
  const { startPeriod, endPeriod, dayLogs, cycles } = useCycleStore();
  const theme = useTheme();
  
  // Logic remains identical
  const today = format(new Date(), 'yyyy-MM-dd');
  // const todayLog = dayLogs.find(l => l.date === today); // Preserved unused var if strictly following "don't touch logic"
  const currentCycle = cycles[cycles.length - 1];
  const isPeriodActive = currentCycle && !currentCycle.endDate;

  const handlePeriodToggle = () => {
    if (isPeriodActive) {
      endPeriod();
      // Replaced toast with native Alert
      Alert.alert('Period ended', 'Take care of yourself! 💕');
    } else {
      startPeriod();
      Alert.alert('Period started', 'Tracking your cycle 🌸');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode={isPeriodActive ? 'contained-tonal' : 'contained'}
        onPress={handlePeriodToggle}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
        // Using Material Community Icons via Paper
        icon={({ size, color }) => (
          <Icon 
            source={isPeriodActive ? "check" : "water"} 
            size={20} 
            color={color} 
          />
        )}
      >
        {isPeriodActive ? "Period Ended" : "Period Started"}
      </Button>

      {isPeriodActive && (
        <Text style={styles.helperText}>
          Tap when your period ends to log the duration
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, // px-4
    paddingVertical: 24,   // py-6
    width: '100%',
  },
  button: {
    width: '100%',
    borderRadius: 8, // Standard radius
    elevation: 4,    // shadow-lg
  },
  buttonContent: {
    height: 56, // h-14
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 18, // text-lg
    fontWeight: '600', // font-semibold
    letterSpacing: 0.5,
  },
  helperText: {
    textAlign: 'center',
    fontSize: 14, // text-sm
    color: '#64748b', // text-muted-foreground (slate-500)
    marginTop: 12, // mt-3
  },
});