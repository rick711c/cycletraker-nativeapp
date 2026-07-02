import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  withSpring,
  runOnJS 
} from 'react-native-reanimated';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Core Application Bindings & State Logic
import { hapticMedium, hapticSuccess } from "@/src/lib/haptics";
import { useAppDispatch, useAppSelector } from "@/src/store";
import { 
  endPeriodRequest, 
  selectCycles, 
  startPeriodRequest 
} from "@/src/store/cycleSlice";

const COLORS = {
  bg: '#000000',
  accent: '#F72585',
  textPrimary: '#FFFFFF',
  textSecondary: '#8E8E93',
  dialogBg: '#141417',
  borderGlass: 'rgba(255, 255, 255, 0.03)'
};

export function QuickActions() {
  const dispatch = useAppDispatch();
  const cyclesData = useAppSelector(selectCycles);

  // Component Modality States
  const [dialogVisible, setDialogVisible] = useState(false);
  const [motivationVisible, setMotivationVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 💡 FIXED: Base verification strictly on actual logs, ignoring the predicted calendar phase trap
  const standardActiveCheck = useMemo(() => {
    let list: any[] = [];
    if (Array.isArray(cyclesData)) {
      list = cyclesData;
    } else if (cyclesData && typeof cyclesData === 'object' && 'cycles' in cyclesData) {
      list = (cyclesData as any).cycles;
    }
    
    if (!Array.isArray(list) || list.length === 0) return false;
    
    // An active period is strictly a log entry that has started but hasn't ended
    return list.some(cycle => cycle && cycle.startDate && !cycle.endDate);
  }, [cyclesData]);

  // 💡 FIXED: Hybrid local state driver prevents asynchronous lag or freezes during rapid clicking
  const [isPeriodActive, setIsPeriodActive] = useState(standardActiveCheck);

  // Keep local layout state fully synchronized whenever Redux completes pipeline flushes
  useEffect(() => {
    setIsPeriodActive(standardActiveCheck);
  }, [standardActiveCheck]);

  // High Performance Shared Values for UI Animations
  const pulse = useSharedValue(1);
  const scaleModal = useSharedValue(0);

  // Looping pulsing interaction for chevron indicator
  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.12, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      true
    );
  }, []);

  // Sync animation scaling to visibility transitions
  useEffect(() => {
    if (motivationVisible) {
      scaleModal.value = withSpring(1, { damping: 15, stiffness: 110 });
    } else {
      scaleModal.value = 0;
    }
  }, [motivationVisible]);

  const animatedChevron = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }]
  }));

  const animatedModalCard = useAnimatedStyle(() => ({
    transform: [{ scale: scaleModal.value }]
  }));

  // Touch Interaction Handlers
  const handleButtonPress = () => { 
    if (isProcessing) return; 
    hapticMedium(); 
    setDialogVisible(true); 
  };

  const handleConfirm = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setDialogVisible(false);
    hapticSuccess();

    if (!isPeriodActive) {
      // Starting period -> Trigger intermediate animation modal
      setMotivationVisible(true);
    } else {
      // Ending period -> Flip state locally instantly, then dispatch to store
      setIsPeriodActive(false); 
      dispatch(endPeriodRequest());
      setTimeout(() => setIsProcessing(false), 400);
    }
  };

  const finalizePeriodStartSequence = () => {
    setIsPeriodActive(true); // Flip state locally instantly
    setMotivationVisible(false);
    dispatch(startPeriodRequest());
    setTimeout(() => setIsProcessing(false), 400);
  };

  const closeMotivation = () => {
    hapticMedium();
    scaleModal.value = withTiming(0, { duration: 180 }, (isFinished) => {
      if (isFinished) {
        runOnJS(finalizePeriodStartSequence)();
      }
    });
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity 
        activeOpacity={0.85} 
        onPress={handleButtonPress}
        disabled={isProcessing}
        style={[
          styles.cardContainer,
          { borderColor: isPeriodActive ? 'rgba(247, 37, 133, 0.4)' : COLORS.borderGlass }
        ]}
      >
        <LinearGradient 
          colors={isPeriodActive ? ['rgba(247, 37, 133, 0.08)', 'rgba(247, 37, 133, 0.02)'] : ['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.01)']} 
          style={styles.gradientInner}
        >
          <View style={styles.leftContainer}>
            <View style={[styles.iconBox, { backgroundColor: isPeriodActive ? 'rgba(247, 37, 133, 0.2)' : 'rgba(255,255,255,0.04)' }]}>
              <MaterialCommunityIcons 
                name={isPeriodActive ? "water" : "water-outline"} 
                size={22} 
                color={COLORS.accent} 
              />
            </View>
            <View style={styles.textStack}>
              <Text style={styles.title}>
                {isPeriodActive ? "Period Active — Tap to End" : "Log Period Start"}
              </Text>
              <Text style={styles.subtitle}>
                {isPeriodActive ? "Currently tracking phase · Close when done" : "Flow might be heavy · Track today"}
              </Text>
            </View>
          </View>

          <Animated.View style={[styles.chevronOuterCircle, animatedChevron]}>
            <MaterialCommunityIcons 
              name={isPeriodActive ? "checkbox-marked-circle-outline" : "chevron-right"} 
              size={18} 
              color={COLORS.accent} 
            />
          </Animated.View>
        </LinearGradient>
        
        <View style={[styles.glowBorder, { borderColor: isPeriodActive ? 'rgba(247, 37, 133, 0.2)' : 'transparent' }]} />
      </TouchableOpacity>

      {/* ─── Dynamic Dialog Portal ─────────────────────────────── */}
      <Portal>
        <Dialog 
          visible={dialogVisible} 
          onDismiss={() => !isProcessing && setDialogVisible(false)} 
          style={styles.dialog}
        >
          <View style={styles.dialogIconContainer}>
            <View style={[styles.dialogIconCircle, { backgroundColor: isPeriodActive ? 'rgba(247, 37, 133, 0.1)' : 'rgba(247, 37, 133, 0.05)' }]}>
              <MaterialCommunityIcons 
                name={isPeriodActive ? "check-circle-outline" : "water-outline"} 
                size={28} 
                color={COLORS.accent} 
              />
            </View>
          </View>
          
          <Dialog.Title style={styles.dialogTitle}>
            {isPeriodActive ? "End Current Period?" : "Start New Period?"}
          </Dialog.Title>
          
          <Dialog.Content style={styles.dialogContentFrame}>
            <Text variant="bodyMedium" style={styles.dialogDescriptionText}>
              {isPeriodActive ? "Confirming that your active menstruation flow has completed?" : "Has your active cycle period initiated today?"}
            </Text>
          </Dialog.Content>
          
          <Dialog.Actions style={styles.dialogActions}>
            <Button mode="text" disabled={isProcessing} onPress={() => setDialogVisible(false)} textColor="#64748B" style={styles.dialogButton}>Cancel</Button>
            <Button mode="contained" disabled={isProcessing} onPress={handleConfirm} buttonColor={COLORS.accent} textColor="#FFF" style={styles.dialogButton}>Yes</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* ─── Motivation Modal Overlay ──────────────────────────── */}
      <Modal transparent visible={motivationVisible} animationType="fade" onRequestClose={closeMotivation}>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.motivationCard, animatedModalCard]}>
            <MaterialCommunityIcons name="creation" size={26} color="#FFD700" style={styles.sparkleIconLeft} />
            <MaterialCommunityIcons name="heart-pulse" size={22} color="#FF6B6B" style={styles.sparkleIconRight} />

            <View style={styles.heartCircleContainer}>
              <MaterialCommunityIcons name="flower-tulip" size={40} color="#FFFFFF" />
            </View>

            <Text style={styles.motivationTitle}>You can do this, strong girl! 💪🌸</Text>
            <Text style={styles.motivationSubtitle}>
              Your body is magical and doing incredible work today. Take a deep breath, be gentle with yourself, and stay comfortable.
            </Text>

            <Button 
              mode="contained" 
              onPress={closeMotivation} 
              buttonColor={COLORS.accent} 
              style={styles.cheerButton} 
              labelStyle={{ fontWeight: '800', fontSize: 15 }}
            >
              Let's do this! 💕
            </Button>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingHorizontal: 24, marginVertical: 12 },
  cardContainer: { height: 72, borderRadius: 24, position: 'relative', overflow: 'hidden', borderWidth: 1 },
  gradientInner: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18 },
  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  textStack: { justifyContent: 'center' },
  title: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary, letterSpacing: 0.1 },
  subtitle: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4, fontWeight: '500' },
  chevronOuterCircle: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  glowBorder: { ...StyleSheet.absoluteFillObject, borderRadius: 24, borderWidth: 1, pointerEvents: 'none' },

  dialog: { borderRadius: 24, marginHorizontal: 24, paddingBottom: 4, backgroundColor: COLORS.dialogBg, borderWidth: 1, borderColor: 'rgba(255,255,255,0.02)' },
  dialogIconContainer: { alignItems: 'center', paddingTop: 26 },
  dialogIconCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  dialogTitle: { textAlign: 'center', fontWeight: '900', fontSize: 20, marginTop: 12, color: '#FFFFFF', letterSpacing: -0.3 },
  dialogContentFrame: { paddingTop: 8, paddingHorizontal: 20 },
  dialogDescriptionText: { color: COLORS.textSecondary, textAlign: 'center', lineHeight: 20, fontWeight: '500' },
  dialogActions: { paddingHorizontal: 16, paddingBottom: 16, gap: 10, flexDirection: 'row', marginTop: 8 },
  dialogButton: { flex: 1, borderRadius: 14, height: 44, justifyContent: 'center' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.84)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
  motivationCard: { width: '100%', backgroundColor: '#131316', borderRadius: 28, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.03)' },
  heartCircleContainer: { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.accent, justifyContent: 'center', alignItems: 'center', marginBottom: 18 },
  motivationTitle: { color: '#FFFFFF', fontWeight: '900', textAlign: 'center', marginBottom: 12, fontSize: 20, letterSpacing: -0.2 },
  motivationSubtitle: { color: COLORS.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 24, paddingHorizontal: 6, fontWeight: '500', fontSize: 14 },
  cheerButton: { width: '100%', borderRadius: 14, height: 46, justifyContent: 'center' },
  sparkleIconLeft: { position: 'absolute', left: 20, top: 20 },
  sparkleIconRight: { position: 'absolute', right: 24, bottom: 84 }
});