import { cyclePhaseColors } from "@/src/theme/muiTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions, Easing } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import { CycleRing, CyclePhase } from "./CycleRing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface AnimeGrasslandCanvasProps {
  dayInCycle: number;
  cycleLength: number;
  currentPhase: CyclePhase;
  periodLength: number;
}

// --- 1. FIXED: Infinite, Continuous Cute Falling Particle Component ---
interface DropProps { left: number; delay: number; duration: number; color: string; icon: any; size: number; }
function CuteRainDrop({ left, delay, duration, color, icon, size }: DropProps) {
  const fallAnim = useRef(new Animated.Value(-20)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Continuous infinite falling loop without long inner delays
    const startFalling = () => {
      fallAnim.setValue(-20);
      Animated.timing(fallAnim, {
        toValue: 440,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startFalling());
    };

    // Initial delayed start so they don't all drop at once
    const timer = setTimeout(startFalling, delay);

    // Continuous side-to-side drift
    Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, { toValue: 1, duration: duration / 2, useNativeDriver: true }),
        Animated.timing(swayAnim, { toValue: -1, duration: duration / 2, useNativeDriver: true }),
      ])
    ).start();

    return () => clearTimeout(timer);
  }, []);

  const opacity = fallAnim.interpolate({
    inputRange: [-20, 30, 390, 440],
    outputRange: [0, 0.7, 0.7, 0], // Fades nicely into the grass roots
  });

  return (
    <Animated.View
      style={[
        styles.absoluteElement,
        {
          left,
          zIndex: 3,
          opacity,
          transform: [
            { translateY: fallAnim },
            { translateX: swayAnim.interpolate({ inputRange: [-1, 1], outputRange: [-15, 15] }) }
          ],
        },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={size} color={color} style={styles.glowDrop} />
    </Animated.View>
  );
}

// --- 2. Anime Snap-Bloom & Swaying Flower Component ---
interface FlowerProps { top: number; left: number; delay: number; size: number; color: string; icon: any; }
function AnimeFlower({ top, left, delay, size, color, icon }: FlowerProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, { toValue: 1, delay, tension: 40, friction: 4, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(swayAnim, { toValue: 1, duration: 2200 + Math.random() * 800, useNativeDriver: true }),
        Animated.timing(swayAnim, { toValue: -1, duration: 2200 + Math.random() * 800, useNativeDriver: true }),
      ])
    ).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.absoluteElement,
        {
          top, left,
          zIndex: 6,
          transform: [
            { scale: scaleAnim }, 
            { rotate: swayAnim.interpolate({ inputRange: [-1, 1], outputRange: ["-10deg", "10deg"] }) }
          ] as any,
          transformOrigin: "bottom center",
        },
      ]}
    >
      <MaterialCommunityIcons name={icon} size={size} color={color} />
    </Animated.View>
  );
}

// --- 3. High-Fidelity Ultra-Cute Animated Vector Cat ---
function AdvancedCuteCat({ top, left }: { top: number; left: number }) {
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const tailAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, { toValue: 1, duration: 1400, useNativeDriver: true }),
        Animated.timing(breatheAnim, { toValue: 0, duration: 1400, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(tailAnim, { toValue: -1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={[styles.absoluteElement, { top, left, zIndex: 8 }]}>
      <Animated.View style={[styles.tailWrapper, { transform: [{ rotate: tailAnim.interpolate({ inputRange: [-1, 1], outputRange: ["-15deg", "25deg"] }) }] }]}>
        <View style={styles.catTail} />
      </Animated.View>

      <Animated.View style={[styles.catBodyFrame, { transform: [{ scaleY: breatheAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.06] }) }] }]}>
        <View style={styles.earLeft} />
        <View style={styles.earRight} />
        <View style={styles.catFaceCircle}>
          <View style={styles.eyeLeft} />
          <View style={styles.eyeRight} />
          <View style={styles.blushLeft} />
          <View style={styles.blushRight} />
          <Text style={styles.catMouth}>w</Text>
        </View>
      </Animated.View>
    </View>
  );
}

export function AnimeGrasslandCanvas({ dayInCycle, cycleLength, currentPhase, periodLength }: AnimeGrasslandCanvasProps) {
  const theme = useTheme();
  const currentPhaseColor = cyclePhaseColors[currentPhase] ?? theme.colors.primary;

  return (
    <View style={styles.canvasContainer}>
      
      {/* 🌸 CONTINUOUS FLOATING DROP MATRIX (Mix of raindrops and flower petals) */}
      <CuteRainDrop left={SCREEN_WIDTH * 0.12} delay={0} duration={4500} color={`${currentPhaseColor}AA`} icon="water" size={13} />
      <CuteRainDrop left={SCREEN_WIDTH * 0.28} delay={1200} duration={5000} color="#FFFFFF60" icon="star" size={10} />
      <CuteRainDrop left={SCREEN_WIDTH * 0.48} delay={600} duration={4200} color={`${currentPhaseColor}CC`} icon="flower-poppy" size={12} />
      <CuteRainDrop left={SCREEN_WIDTH * 0.68} delay={2000} duration={5500} color="#FFFFFF50" icon="water" size={14} />
      <CuteRainDrop left={SCREEN_WIDTH * 0.88} delay={900} duration={4800} color={`${currentPhaseColor}90`} icon="flower-tulip" size={11} />

      <View style={styles.headerRow}>
        <View style={styles.brandContainer}>
          <MaterialCommunityIcons name="flower-tulip" size={26} color="#E91E63" style={{ marginRight: 8 }} />
          <Text variant="headlineMedium" style={styles.brandText}>Flora</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text variant="bodySmall" style={{ color: "#757575", fontWeight: "500" }}>Today</Text>
          <Text variant="bodyMedium" style={{ color: "#FFF", fontWeight: "600" }}>Tue, Jun 23</Text>
        </View>
      </View>

      <View style={styles.ringWrapper}>
        <CycleRing dayInCycle={dayInCycle} cycleLength={cycleLength} currentPhase={currentPhase} periodLength={periodLength} />
      </View>

      <View style={styles.grasslandBase}>
        <Svg width={SCREEN_WIDTH} height={120} viewBox={`0 0 ${SCREEN_WIDTH} 120`} fill="none">
          <Path d={`M0 60 Q ${SCREEN_WIDTH * 0.35} 20, ${SCREEN_WIDTH * 0.7} 50 T ${SCREEN_WIDTH} 40 L ${SCREEN_WIDTH} 120 L 0 120 Z`} fill="#0A120D" />
          <Path d={`M0 80 Q ${SCREEN_WIDTH * 0.25} 50, ${SCREEN_WIDTH * 0.55} 75 T ${SCREEN_WIDTH} 65 L ${SCREEN_WIDTH} 120 L 0 120 Z`} fill="#121F16" />
        </Svg>
      </View>

      <AdvancedCuteCat top={382} left={SCREEN_WIDTH * 0.68} />

      <AnimeFlower top={385} left={SCREEN_WIDTH * 0.08} delay={200} size={22} color={currentPhaseColor} icon="flower-poppy" />
      <AnimeFlower top={410} left={SCREEN_WIDTH * 0.15} delay={500} size={16} color="#FFF" icon="flower" />
      <AnimeFlower top={395} left={SCREEN_WIDTH * 0.20} delay={800} size={18} color={currentPhaseColor} icon="flower-tulip" />
      <AnimeFlower top={415} left={SCREEN_WIDTH * 0.36} delay={300} size={15} color="#FFF" icon="flower" />
      <AnimeFlower top={400} left={SCREEN_WIDTH * 0.46} delay={1100} size={20} color={currentPhaseColor} icon="flower-poppy" />
      <AnimeFlower top={412} left={SCREEN_WIDTH * 0.58} delay={900} size={17} color="#FFF" icon="flower" />
      <AnimeFlower top={402} left={SCREEN_WIDTH * 0.82} delay={400} size={21} color={currentPhaseColor} icon="flower-tulip" />
      <AnimeFlower top={385} left={SCREEN_WIDTH * 0.90} delay={150} size={22} color={currentPhaseColor} icon="flower-poppy" />
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: { width: "100%", height: 460, backgroundColor: "#000000", position: "relative", overflow: "hidden" },
  absoluteElement: { position: "absolute" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 50, width: "100%", zIndex: 10 },
  brandContainer: { flexDirection: "row", alignItems: "center" },
  brandText: { fontWeight: "800", color: "#FFFFFF", fontSize: 28, letterSpacing: -0.5 },
  dateContainer: { alignItems: "flex-end" },
  ringWrapper: { position: "absolute", top: 130, left: 0, right: 0, alignItems: "center", justifyContent: "center", zIndex: 5 },
  grasslandBase: { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 4 },
  glowDrop: { shadowColor: "#FFF", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2 },
  catBodyFrame: { width: 36, height: 32, alignItems: "center", justifyContent: "flex-end" },
  catFaceCircle: { width: 34, height: 28, borderRadius: 14, backgroundColor: "#FFFFFF", position: "relative", justifyContent: "center", alignItems: "center" },
  earLeft: { position: "absolute", left: 2, top: 0, width: 0, height: 0, borderStyle: "solid", borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 8, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#FFFFFF", transform: [{ rotate: "-25deg" }] },
  earRight: { position: "absolute", right: 2, top: 0, width: 0, height: 0, borderStyle: "solid", borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 8, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#FFFFFF", transform: [{ rotate: "25deg" }] },
  eyeLeft: { position: "absolute", left: 8, top: 10, width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#2D3748" },
  eyeRight: { position: "absolute", right: 8, top: 10, width: 3, height: 3, borderRadius: 1.5, backgroundColor: "#2D3748" },
  blushLeft: { position: "absolute", left: 5, top: 14, width: 5, height: 3, borderRadius: 2, backgroundColor: "#FFB7B2", opacity: 0.8 },
  blushRight: { position: "absolute", right: 5, top: 14, width: 5, height: 3, borderRadius: 2, backgroundColor: "#FFB7B2", opacity: 0.8 },
  catMouth: { fontSize: 9, color: "#2D3748", position: "absolute", bottom: 6, fontWeight: "700" },
  tailWrapper: { position: "absolute", right: -4, bottom: 2, transformOrigin: "left center" },
  catTail: { width: 12, height: 4, borderRadius: 2, backgroundColor: "#FFFFFF" },
});