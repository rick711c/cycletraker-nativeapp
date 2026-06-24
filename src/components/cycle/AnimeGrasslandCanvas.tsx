import { cyclePhaseColors } from "@/src/theme/muiTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions, Easing } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import { CycleRing, CyclePhase } from "./CycleRing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAT_WIDTH = 90; 

interface AnimeGrasslandCanvasProps {
  dayInCycle: number;
  cycleLength: number;
  currentPhase: CyclePhase;
  periodLength: number;
}

// --- 1. Infinite, Continuous Cute Falling Particle Component ---
interface DropProps { 
  left: `${number}%`; // Strict TypeScript template literal type constraint
  delay: number; 
  duration: number; 
  color: string; 
  icon: any; 
  size: number; 
}

function CuteRainDrop({ left, delay, duration, color, icon, size }: DropProps) {
  const fallAnim = useRef(new Animated.Value(-20)).current;
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startFalling = () => {
      fallAnim.setValue(-20);
      Animated.timing(fallAnim, {
        toValue: 440,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => startFalling());
    };

    const timer = setTimeout(startFalling, delay);

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
    outputRange: [0, 0.7, 0.7, 0],
  });

  return (
    <Animated.View
      style={[
        styles.absoluteElement,
        {
          left, 
          zIndex: 9, 
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
interface FlowerProps { 
  top: number; 
  left: `${number}%`; // Strict TypeScript template literal type constraint
  delay: number; 
  size: number; 
  color: string; 
  icon: any; 
}

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

// --- 3. High-Fidelity MAGNIFIED & Fully Automated Walking Cat ---
function AdvancedCuteCat({ top }: { top: number }) {
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const tailAnim = useRef(new Animated.Value(0)).current;
  const walkLoopAnim = useRef(new Animated.Value(0)).current; 

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

    Animated.loop(
      Animated.sequence([
        Animated.timing(walkLoopAnim, {
          toValue: 1,
          duration: 7000, 
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(walkLoopAnim, {
          toValue: 2,
          duration: 7000, 
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const translateX = walkLoopAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [15, SCREEN_WIDTH - CAT_WIDTH - 15, 15],
  });

  const scaleX = walkLoopAnim.interpolate({
    inputRange: [0, 0.99, 1, 1.99, 2],
    outputRange: [1, 1, -1, -1, 1],
  });

  return (
    <Animated.View 
      style={[
        styles.absoluteElement, 
        { 
          top, 
          left: 0, 
          width: CAT_WIDTH, 
          height: 80,
          zIndex: 8,
          transform: [
            { translateX },
            { scaleX }
          ]
        }
      ]}
    >
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
    </Animated.View>
  );
}

export function AnimeGrasslandCanvas({ dayInCycle, cycleLength, currentPhase, periodLength }: AnimeGrasslandCanvasProps) {
  const theme = useTheme();
  const currentPhaseColor = cyclePhaseColors[currentPhase] ?? theme.colors.primary;

  return (
    <View style={styles.canvasContainer}>
      
      {/* 🌸 RICH, SEAMLESS & HIGH-DENSITY PARTICLE LAYER SPREAD ALL OVER THE ENTIRE WIDTH */}
      <CuteRainDrop left="4%" delay={0} duration={3200} color={`${currentPhaseColor}BB`} icon="flower-poppy" size={14} />
      <CuteRainDrop left="13%" delay={800} duration={2800} color="#FFFFFF70" icon="star" size={10} />
      <CuteRainDrop left="22%" delay={400} duration={3500} color={`${currentPhaseColor}AA`} icon="water" size={13} />
      <CuteRainDrop left="31%" delay={1200} duration={3000} color={`${currentPhaseColor}DD`} icon="flower-tulip" size={12} />
      <CuteRainDrop left="40%" delay={150} duration={2700} color="#FFFFFF60" icon="sparkles" size={11} />
      <CuteRainDrop left="49%" delay={950} duration={3300} color={`${currentPhaseColor}CC`} icon="flower-poppy" size={13} />
      <CuteRainDrop left="58%" delay={500} duration={3100} color="#FFFFFF50" icon="water" size={14} />
      <CuteRainDrop left="67%" delay={1400} duration={2900} color={`${currentPhaseColor}EE`} icon="flower-tulip" size={11} />
      <CuteRainDrop left="76%" delay={300} duration={3400} color="#FFFFFF80" icon="star" size={12} />
      <CuteRainDrop left="85%" delay={1100} duration={2600} color={`${currentPhaseColor}90`} icon="sparkles" size={10} />
      <CuteRainDrop left="93%" delay={650} duration={3200} color={`${currentPhaseColor}AA`} icon="water" size={12} />

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
        <Svg width="100%" height={120} viewBox={`0 0 ${SCREEN_WIDTH} 120`} fill="none">
          <Path d={`M0 60 Q ${SCREEN_WIDTH * 0.35} 20, ${SCREEN_WIDTH * 0.7} 50 T ${SCREEN_WIDTH} 40 L ${SCREEN_WIDTH} 120 L 0 120 Z`} fill="#0A120D" />
          <Path d={`M0 80 Q ${SCREEN_WIDTH * 0.25} 50, ${SCREEN_WIDTH * 0.55} 75 T ${SCREEN_WIDTH} 65 L ${SCREEN_WIDTH} 120 L 0 120 Z`} fill="#121F16" />
        </Svg>
      </View>

      <AdvancedCuteCat top={334} />

      {/* 🌸 SWAYING GROUND FLOWERS SPREAD ALL OVER THE ENTIRE WIDTH */}
      <AnimeFlower top={385} left="6%" delay={200} size={22} color={currentPhaseColor} icon="flower-poppy" />
      <AnimeFlower top={410} left="16%" delay={500} size={16} color="#FFF" icon="flower" />
      <AnimeFlower top={395} left="26%" delay={800} size={18} color={currentPhaseColor} icon="flower-tulip" />
      <AnimeFlower top={415} left="37%" delay={300} size={15} color="#FFF" icon="flower" />
      <AnimeFlower top={400} left="48%" delay={1100} size={20} color={currentPhaseColor} icon="flower-poppy" />
      <AnimeFlower top={412} left="59%" delay={900} size={17} color="#FFF" icon="flower" />
      <AnimeFlower top={402} left="70%" delay={400} size={21} color={currentPhaseColor} icon="flower-tulip" />
      <AnimeFlower top={390} left="81%" delay={700} size={16} color="#FFF" icon="flower" />
      <AnimeFlower top={408} left="89%" delay={1300} size={18} color={currentPhaseColor} icon="flower-poppy" />
      <AnimeFlower top={385} left="95%" delay={150} size={22} color={currentPhaseColor} icon="flower-poppy" />
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
  
  catBodyFrame: { width: CAT_WIDTH, height: 80, alignItems: "center", justifyContent: "flex-end" },
  catFaceCircle: { width: 86, height: 70, borderRadius: 35, backgroundColor: "#FFFFFF", position: "relative", justifyContent: "center", alignItems: "center" },
  earLeft: { position: "absolute", left: 6, top: -2, width: 0, height: 0, borderStyle: "solid", borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 20, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#FFFFFF", transform: [{ rotate: "-25deg" }] },
  earRight: { position: "absolute", right: 6, top: -2, width: 0, height: 0, borderStyle: "solid", borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 20, borderLeftColor: "transparent", borderRightColor: "transparent", borderBottomColor: "#FFFFFF", transform: [{ rotate: "25deg" }] },
  eyeLeft: { position: "absolute", left: 22, top: 24, width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#2D3748" },
  eyeRight: { position: "absolute", right: 22, top: 24, width: 7, height: 7, borderRadius: 3.5, backgroundColor: "#2D3748" },
  blushLeft: { position: "absolute", left: 14, top: 34, width: 12, height: 7, borderRadius: 3.5, backgroundColor: "#FFB7B2", opacity: 0.8 },
  blushRight: { position: "absolute", right: 14, top: 34, width: 12, height: 7, borderRadius: 3.5, backgroundColor: "#FFB7B2", opacity: 0.8 },
  catMouth: { fontSize: 22, color: "#2D3748", position: "absolute", bottom: 14, fontWeight: "800" },
  tailWrapper: { position: "absolute", right: -12, bottom: 6, transformOrigin: "left center" },
  catTail: { width: 30, height: 10, borderRadius: 5, backgroundColor: "#FFFFFF" },
});