import { hapticMedium, hapticSuccess } from "@/src/lib/haptics";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { endPeriodRequest, selectCycles, startPeriodRequest } from "@/src/store/cycleSlice";
import React, { useState, useRef } from "react";
import { StyleSheet, View, Modal, Animated } from "react-native";
import { Button, Dialog, Portal, Text, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Icon from "../ui/Icon";

export function QuickActions() {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const cycles = useAppSelector(selectCycles);

  const [dialogVisible, setDialogVisible] = useState(false);
  const [motivationVisible, setMotivationVisible] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const currentCycle = cycles[cycles.length - 1];
  const isPeriodActive = currentCycle && !currentCycle.endDate;

  const handleButtonPress = () => { hapticMedium(); setDialogVisible(true); };

  const handleConfirm = () => {
    hapticSuccess();
    if (!isPeriodActive) {
      // Show custom anime motivation overlay only when starting a period
      setDialogVisible(false);
      setMotivationVisible(true);
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 6, useNativeDriver: true }).start();
    } else {
      dispatch(endPeriodRequest());
      setDialogVisible(false);
    }
  };

  const closeMotivation = () => {
    Animated.timing(scaleAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => {
      setMotivationVisible(false);
      dispatch(startPeriodRequest()); // Dispatches and updates the layout theme colors
    });
  };

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={handleButtonPress}
        icon={isPeriodActive ? "check" : "water"}
        buttonColor={isPeriodActive ? theme.colors.secondaryContainer : theme.colors.primary}
        textColor={isPeriodActive ? theme.colors.onSecondaryContainer : theme.colors.onPrimary}
        contentStyle={styles.buttonContent}
        style={[styles.button, !isPeriodActive && { elevation: 4 }]}
        labelStyle={styles.buttonLabel}
      >
        {isPeriodActive ? "Period Ended" : "Period Started"}
      </Button>

      {/* ============== CONFIRMATION CONFIRM DIALOG ============== */}
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)} style={[styles.dialog, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.dialogIconContainer}>
            <View style={[styles.dialogIconCircle, { backgroundColor: isPeriodActive ? `${theme.colors.secondary}15` : `${theme.colors.primary}15` }]}>
              <Icon icon={isPeriodActive ? "check-circle-outline" : "water-outline"} size={30} color={isPeriodActive ? theme.colors.secondary : theme.colors.primary} />
            </View>
          </View>
          <Dialog.Title style={styles.dialogTitle}>{isPeriodActive ? "End Period?" : "Start Period?"}</Dialog.Title>
          <Dialog.Content style={{ paddingTop: 12, paddingHorizontal: 24 }}>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
              {isPeriodActive ? "Are you sure your period has ended?" : "Has your period started today?"}
            </Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button mode="text" onPress={() => setDialogVisible(false)} textColor={theme.colors.onSurfaceVariant} style={styles.dialogButton}>Cancel</Button>
            <Button mode="contained" onPress={handleConfirm} buttonColor={isPeriodActive ? theme.colors.secondary : theme.colors.primary} style={styles.dialogButton}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* ============== ✨ NEW ANIME MOTIVATION POPUP OVERLAY ✨ ============== */}
      <Modal transparent visible={motivationVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.motivationCard, { transform: [{ scale: scaleAnim }] }]}>

            {/* Floating Magical Accent Patterns */}
            <MaterialCommunityIcons
              name="creation" // ✨ Swapped from "sparkles" to "creation" to fix the TypeScript error!
              size={28}
              color="#FFD700"
              style={styles.sparkleIconLeft}
            />
            <MaterialCommunityIcons name="heart-pulse" size={24} color="#FF6B6B" style={styles.sparkleIconRight} />

            <View style={styles.heartCircleContainer}>
              <MaterialCommunityIcons name="flower-tulip" size={42} color="#FFFFFF" />
            </View>

            <Text variant="headlineSmall" style={styles.motivationTitle}>
              You can do this, strong girl! 💪🌸
            </Text>

            <Text variant="bodyMedium" style={styles.motivationSubtitle}>
              Your body is magical and doing incredible work today. Take a deep breath, be gentle with yourself, and stay comfortable.
            </Text>

            <Button mode="contained" onPress={closeMotivation} buttonColor="#E91E63" style={styles.cheerButton} labelStyle={{ fontWeight: "700" }}>
              Let's do this! 💕
            </Button>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 24, paddingVertical: 16, width: "100%" },
  button: { width: "100%", borderRadius: 28 },
  buttonContent: { height: 54, flexDirection: "row-reverse" },
  buttonLabel: { fontSize: 16, fontWeight: "700" },
  dialog: { borderRadius: 28, marginHorizontal: 24, paddingBottom: 4 },
  dialogIconContainer: { alignItems: "center", paddingTop: 28 },
  dialogIconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  dialogTitle: { textAlign: "center", fontWeight: "800", fontSize: 20, marginTop: 12 },
  dialogActions: { paddingHorizontal: 20, paddingBottom: 20, gap: 12, flexDirection: "row" },
  dialogButton: { flex: 1, borderRadius: 20, height: 44, justifyContent: "center" },

  // --- Motivation Modal Overlay Rules ---
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.78)", justifyContent: "center", alignItems: "center", paddingHorizontal: 24 },
  motivationCard: { width: "100%", backgroundColor: "#18181C", borderRadius: 32, padding: 32, alignItems: "center", borderWidth: 1, borderColor: "#333" },
  heartCircleContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#E91E63", justifyContent: "center", alignItems: "center", marginBottom: 20, shadowColor: "#E91E63", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8 },
  motivationTitle: { color: "#FFFFFF", fontWeight: "800", textAlign: "center", marginBottom: 12, fontSize: 22 },
  motivationSubtitle: { color: "#B3B3B3", textAlign: "center", lineHeight: 22, marginBottom: 28, paddingHorizontal: 8 },
  cheerButton: { width: "100%", borderRadius: 20, height: 48, justifyContent: "center" },
  sparkleIconLeft: { position: "absolute", left: 24, top: 24 },
  sparkleIconRight: { position: "absolute", right: 28, bottom: 90 },
});