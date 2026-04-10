import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, Dialog, Portal, useTheme } from 'react-native-paper';
import { hapticMedium, hapticSuccess } from '../../lib/haptics';
import { format } from 'date-fns';
import { useAppSelector, useAppDispatch } from '../../store';
import { selectCycles, startPeriodRequest, endPeriodRequest } from '../../store/cycleSlice';
import Icon from '../ui/Icon';

export function QuickActions() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const cycles = useAppSelector(selectCycles);
  const [dialogVisible, setDialogVisible] = useState(false);

  const today = format(new Date(), 'yyyy-MM-dd');
  const currentCycle = cycles[cycles.length - 1];
  const isPeriodActive = currentCycle && !currentCycle.endDate;

  const handleButtonPress = () => {
    hapticMedium();
    setDialogVisible(true);
  };

  const handleConfirm = () => {
    hapticSuccess();
    if (isPeriodActive) {
      dispatch(endPeriodRequest());
    } else {
      dispatch(startPeriodRequest());
    }
    setDialogVisible(false);
  };

  const handleDismiss = () => {
    setDialogVisible(false);
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={handleButtonPress}
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

      {/* Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={handleDismiss}
          style={[styles.dialog, { backgroundColor: theme.colors.surface }]}
        >
          {/* Icon header */}
          <View style={styles.dialogIconContainer}>
            <View
              style={[
                styles.dialogIconCircle,
                {
                  backgroundColor: isPeriodActive
                    ? `${theme.colors.secondary}20`
                    : `${theme.colors.primary}20`,
                },
              ]}
            >
              <Icon
                icon={isPeriodActive ? 'check-circle-outline' : 'water-outline'}
                size={32}
                color={isPeriodActive ? theme.colors.secondary : theme.colors.primary}
              />
            </View>
          </View>

          <Dialog.Title style={styles.dialogTitle}>
            {isPeriodActive ? 'End Period?' : 'Start Period?'}
          </Dialog.Title>

          <Dialog.Content>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center' }}>
              {isPeriodActive
                ? 'Are you sure your period has ended? This will log the duration of your current cycle.'
                : 'Has your period started today? This will begin tracking a new cycle.'}
            </Text>
          </Dialog.Content>

          <Dialog.Actions style={styles.dialogActions}>
            <Button
              mode="text"
              onPress={handleDismiss}
              textColor={theme.colors.onSurfaceVariant}
              style={styles.dialogButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleConfirm}
              buttonColor={isPeriodActive ? theme.colors.secondary : theme.colors.primary}
              style={styles.dialogButton}
            >
              {isPeriodActive ? 'Yes, it ended' : 'Yes, it started'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  button: {
    width: '100%',
    borderRadius: 4,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  helperText: {
    marginTop: 12,
    textAlign: 'center',
  },

  // Dialog
  dialog: {
    borderRadius: 24,
    marginHorizontal: 24,
  },
  dialogIconContainer: {
    alignItems: 'center',
    paddingTop: 24,
  },
  dialogIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogTitle: {
    textAlign: 'center',
    fontWeight: '700',
  },
  dialogActions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  dialogButton: {
    flex: 1,
    borderRadius: 12,
  },
});