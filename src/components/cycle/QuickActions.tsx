import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import { format } from 'date-fns';
import { useCycleStore } from '@/hooks/useCycleStore'; // Ensure this path matches your project

// Note: 'notistack' is web-only. 
// For React Native, consider using 'react-native-snackbar' or 'react-native-toast-message'.
// I've used a simple console log/placeholder here.

export function QuickActions() {
  const theme = useTheme();
  const { startPeriod, endPeriod, dayLogs, cycles } = useCycleStore();
  
  const today = format(new Date(), 'yyyy-MM-dd');
  // const todayLog = dayLogs.find((l) => l.date === today); // logic preserved from original
  const currentCycle = cycles[cycles.length - 1];
  const isPeriodActive = currentCycle && !currentCycle.endDate;

  const handlePeriodToggle = () => {
    if (isPeriodActive) {
      endPeriod();
      // Replace with your toast library, e.g., Snackbar.show({ text: 'Period ended...' });
      console.log('Period ended - Take care of yourself! 💕');
    } else {
      startPeriod();
      console.log('Period started - Tracking your cycle 🌸');
    }
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={handlePeriodToggle}
        // Paper uses MaterialCommunityIcons names. 'water' is equivalent to WaterDrop, 'check' to Check
        icon={isPeriodActive ? 'check' : 'water'} 
        buttonColor={isPeriodActive ? theme.colors.secondary : theme.colors.primary}
        textColor={isPeriodActive ? theme.colors.onSecondary : theme.colors.onPrimary}
        contentStyle={styles.buttonContent}
        style={styles.button}
        labelStyle={styles.buttonLabel}
      >
        {isPeriodActive ? 'Period Ended' : 'Period Started'}
      </Button>

      {isPeriodActive && (
        <Text
          variant="bodyMedium"
          style={[styles.helperText, { color: theme.colors.onSurfaceVariant }]}
        >
          Tap when your period ends to log the duration
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16, // px: 2
    paddingVertical: 24,   // py: 3
  },
  button: {
    width: '100%',
    borderRadius: 4, // standard material button radius, or use theme.roundness
  },
  buttonContent: {
    height: 56, // matches sx={{ height: 56 }}
  },
  buttonLabel: {
    fontSize: 17, // ~1.1rem
    fontWeight: '600',
    // Paper handles uppercase automatically depending on version, 
    // add textTransform: 'none' if you want mixed case like the web version often has
  },
  helperText: {
    marginTop: 12, // mt: 1.5 (1.5 * 8 = 12)
    textAlign: 'center',
  },
});