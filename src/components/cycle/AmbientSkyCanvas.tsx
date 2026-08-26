import { cyclePhaseColors } from "@/src/theme/muiTheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Animated, Dimensions, Easing } from "react-native";
import { Text, useTheme } from "react-native-paper";
import Svg, { Path } from "react-native-svg";
import { CyclePhase } from "./CycleRing";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DOG_WIDTH = 94; 

interface AnimeGrasslandCanvasProps {
  dayInCycle: number;
  cycleLength: number;
  currentPhase: CyclePhase;
  periodLength: number;
  nextPeriodDate?: string | Date;
}

interface DropProps { 
  left: `${number}%`; 
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
        toValue: 450,
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
    inputRange: [-20, 30, 400, 450],
    outputRange: [0, 0.6, 0.6, 0],
  });

  return (
    <Animated.View style={[styles.absoluteElement, { left, zIndex: 3, opacity, transform: [{ translateY: fallAnim }, { translateX: swayAnim.interpolate({ inputRange: [-1, 1], outputRange: [-12, 12] }) }] }]}>
      <MaterialCommunityIcons name={icon} size={size} color={color} style={styles.glowDrop} />
    </Animated.View>
  );
}

interface DogProps {
  top: number;
  dogX: Animated.Value;
  dogScaleX: Animated.Value;
}

function AdvancedCuteDog({ top, dogX, dogScaleX }: DogProps) {
  const breatheAnim = useRef(new Animated.Value(0)).current;
  const tailAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breatheAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(breatheAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(tailAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(tailAnim, { toValue: -1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.absoluteElement, { top, left: 0, width: DOG_WIDTH, height: 80, zIndex: 8, transform: [{ translateX: dogX }, { scaleX: dogScaleX }] }]}>
      <Animated.View style={[styles.dogTailWrapper, { transform: [{ rotate: tailAnim.interpolate({ inputRange: [-1, 1], outputRange: ["-25deg", "15deg"] }) }] }]}>
        <View style={styles.dogTail} />
      </Animated.View>

      <Animated.View style={[styles.dogBodyFrame, { transform: [{ scaleY: breatheAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] }) }] }]}>
        <View style={styles.earDogLeft} />
        <View style={styles.earDogRight} />
        <View style={styles.dogFaceCircle}>
          <View style={styles.dogEyeLeft} />
          <View style={styles.dogEyeRight} />
          <View style={styles.dogSnout}>
            <View style={styles.dogNose} />
            <View style={styles.dogMouthLine} />
          </View>
          <View style={styles.blushLeft} />
          <View style={styles.blushRight} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export function AnimeGrasslandCanvas({ dayInCycle, currentPhase, nextPeriodDate }: AnimeGrasslandCanvasProps) {
  const theme = useTheme();
  const currentPhaseColor = cyclePhaseColors[currentPhase] ?? theme.colors.primary;

  const dogX = useRef(new Animated.Value((SCREEN_WIDTH - DOG_WIDTH) / 2)).current;
  const dogScaleX = useRef(new Animated.Value(1)).current;
  const currentX = useRef((SCREEN_WIDTH - DOG_WIDTH) / 2);

  useEffect(() => {
    const listenerId = dogX.addListener(({ value }) => { currentX.current = value; });
    return () => dogX.removeListener(listenerId);
  }, []);

  const handleCanvasTouch = (event: any) => {
    const touchX = event.nativeEvent.locationX;
    const targetX = Math.max(15, Math.min(touchX - DOG_WIDTH / 2, SCREEN_WIDTH - DOG_WIDTH - 15));
    dogScaleX.setValue(targetX > currentX.current ? -1 : 1);

    Animated.spring(dogX, {
      toValue: targetX,
      tension: 40,
      friction: 6,
      useNativeDriver: true,
    }).start();
  };

  // Extract exact day and month separately to power the premium high-contrast circular dashboard view
  let targetDay = "30";
  let targetMonthYear = "July 2026";

  if (nextPeriodDate) {
    const parsedDate = typeof nextPeriodDate === "string" ? new Date(nextPeriodDate) : nextPeriodDate;
    if (!isNaN(parsedDate.getTime())) {
      targetDay = parsedDate.getDate().toString();
      targetMonthYear = parsedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
  }

  return (
    <View style={styles.canvasContainer} onTouchStart={handleCanvasTouch}>
      {/* Immersive Floating Flower Particles */}
      <CuteRainDrop left="6%" delay={0} duration={3400} color="rgba(255, 51, 102, 0.4)" icon="flower-poppy" size={13} />
      <CuteRainDrop left="18%" delay={600} duration={2900} color="#FFFFFF40" icon="star" size={9} />
      <CuteRainDrop left="28%" delay={300} duration={3600} color="rgba(255, 51, 102, 0.3)" icon="water" size={12} />
      <CuteRainDrop left="74%" delay={800} duration={3100} color="#FFFFFF50" icon="sparkle" size={10} />
      <CuteRainDrop left="88%" delay={150} duration={3300} color="rgba(255, 51, 102, 0.4)" icon="flower-tulip" size={12} />

      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.brandContainer}>
          <MaterialCommunityIcons name="flower-tulip" size={24} color="#FF3366" style={{ marginRight: 6 }} />
          <Text variant="headlineMedium" style={styles.brandText}>Flora</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.todayLabel}>Today</Text>
          <Text style={styles.todayValue}>Tue, Jun 23</Text>
        </View>
      </View>

      {/* PREMIUM GLOWING ORB CONTAINER (As seen in image_970718.jpg) */}
      <View style={styles.centerOrbWrapper}>
        {/* Soft Ambient Outer Aura Backdrops */}
        <View style={[styles.radialGlowRing, { shadowColor: currentPhaseColor, borderColor: `${currentPhaseColor}30` }]} />
        
        <View style={styles.mainCoreOrbCircle}>
          <Text style={styles.orbUpperLabel}>NEXT PERIOD</Text>
          <Text style={[styles.orbDayNumeric, { color: currentPhaseColor }]}>{targetDay}</Text>
          <Text style={styles.orbMonthLabel}>{targetMonthYear}</Text>
          
          <View style={styles.dividerDot} />
          <Text style={styles.countdownSubtitle}>5 days left</Text>
        </View>

        {/* Delicate Sakura Blossom Overlays Hugging Perimeter */}
        <MaterialCommunityIcons name="flower" size={26} color="#FF7EA5" style={[styles.sakuraOrnament, { top: 0, right: 12 }]} />
        <MaterialCommunityIcons name="flower" size={32} color="#FF3366" style={[styles.sakuraOrnament, { top: 24, right: -10 }]} />
        <MaterialCommunityIcons name="flower" size={20} color="#FF7EA5" style={[styles.sakuraOrnament, { bottom: 18, left: -6 }]} />
        <MaterialCommunityIcons name="flower" size={24} color="#FF3366" style={[styles.sakuraOrnament, { bottom: 45, right: -12 }]} />
        <MaterialCommunityIcons name="flower" size={18} color="#FFF" style={[styles.sakuraOrnament, { top: 40, left: -8, opacity: 0.8 }]} />
      </View>

      {/* Premium Horizontal Action Capsules */}
      <View style={styles.capsuleClusterRow}>
        <View style={styles.premiumCapsule}>
          <Text style={styles.capsuleText}>Day {dayInCycle} of cycle</Text>
        </View>
        <View style={[styles.premiumCapsule, { backgroundColor: "#FF3366" }]}>
          <Text style={[styles.capsuleText, { color: "#FFFFFF", fontWeight: "700" }]}>
            {currentPhase.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Ground Horizon Backdrops */}
      <View style={styles.grasslandBase}>
        <Svg width="100%" height={80} viewBox={`0 0 ${SCREEN_WIDTH} 80`} fill="none">
          <Path d={`M0 40 Q ${SCREEN_WIDTH * 0.3} 15, ${SCREEN_WIDTH * 0.65} 35 T ${SCREEN_WIDTH} 25 L ${SCREEN_WIDTH} 80 L 0 80 Z`} fill="#070709" />
          <Path d={`M0 55 Q ${SCREEN_WIDTH * 0.2} 35, ${SCREEN_WIDTH * 0.5} 50 T ${SCREEN_WIDTH} 42 L ${SCREEN_WIDTH} 80 L 0 80 Z`} fill="#0D0E12" />
        </Svg>
      </View>

      {/* Interactive Walking Puppy Dog */}
      <AdvancedCuteDog top={382} dogX={dogX} dogScaleX={dogScaleX} />
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: { width: "100%", height: 465, backgroundColor: "#000000", position: "relative", overflow: "hidden" },
  absoluteElement: { position: "absolute" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 48, width: "100%", zIndex: 10 },
  brandContainer: { flexDirection: "row", alignItems: "center" },
  brandText: { fontWeight: "900", color: "#FFFFFF", fontSize: 26, letterSpacing: -0.5 },
  dateContainer: { alignItems: "flex-end" },
  todayLabel: { color: "#64748B", fontSize: 11, fontWeight: "600", letterSpacing: 0.5 },
  todayValue: { color: "#FFF", fontSize: 14, fontWeight: "700", marginTop: 1 },

  // Premium Circular Glowing Presentation Architectures
  centerOrbWrapper: { position: "absolute", top: 112, alignSelf: "center", width: 200, height: 200, alignItems: "center", justifyContent: "center", zIndex: 5 },
  radialGlowRing: { position: "absolute", width: 200, height: 200, borderRadius: 100, borderWidth: 1.5, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 25, backgroundColor: "transparent" },
  mainCoreOrbCircle: { width: 184, height: 184, borderRadius: 92, backgroundColor: "#09090B", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.03)" },
  orbUpperLabel: { fontSize: 11, fontWeight: "800", color: "#64748B", letterSpacing: 1.2, marginBottom: 2 },
  orbDayNumeric: { fontSize: 52, fontWeight: "900", letterSpacing: -1, lineHeight: 56 },
  orbMonthLabel: { fontSize: 14, fontWeight: "700", color: "#94A3B8" },
  dividerDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: "#FF3366", marginVertical: 8, opacity: 0.6 },
  countdownSubtitle: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  sakuraOrnament: { position: "absolute", zIndex: 6, shadowColor: "#FF3366", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.4, shadowRadius: 4 },

  // Capsule rows directly beneath the circular dashboard ring
  capsuleClusterRow: { position: "absolute", top: 334, alignSelf: "center", flexDirection: "row", gap: 8, zIndex: 10 },
  premiumCapsule: { backgroundColor: "rgba(255,255,255,0.05)", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 30, borderWidth: 1, borderColor: "rgba(255,255,255,0.02)" },
  capsuleText: { color: "#E2E8F0", fontSize: 12, fontWeight: "600", letterSpacing: 0.2 },

  grasslandBase: { position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 4 },
  glowDrop: { shadowColor: "#FF3366", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.4, shadowRadius: 3 },
  
  // Puppy Form Vector Styles
  dogBodyFrame: { width: DOG_WIDTH, height: 80, alignItems: "center", justifyContent: "flex-end" },
  dogFaceCircle: { width: 84, height: 72, borderRadius: 38, backgroundColor: "#FFFFFF", position: "relative", justifyContent: "center", alignItems: "center" },
  earDogLeft: { position: "absolute", left: -5, top: 12, width: 15, height: 35, borderRadius: 8, backgroundColor: "#E2E8F0", transform: [{ rotate: "10deg" }] },
  earDogRight: { position: "absolute", right: -5, top: 12, width: 15, height: 35, borderRadius: 8, backgroundColor: "#E2E8F0", transform: [{ rotate: "-10deg" }] },
  dogEyeLeft: { position: "absolute", left: 24, top: 26, width: 6.5, height: 6.5, borderRadius: 3.25, backgroundColor: "#1E293B" },
  dogEyeRight: { position: "absolute", right: 24, top: 26, width: 6.5, height: 6.5, borderRadius: 3.25, backgroundColor: "#1E293B" },
  dogSnout: { position: "absolute", bottom: 22, alignItems: "center" },
  dogNose: { width: 9, height: 5.5, borderRadius: 3, backgroundColor: "#0F172A" },
  dogMouthLine: { width: 1.5, height: 4, backgroundColor: "#0F172A", marginTop: 1 },
  blushLeft: { position: "absolute", left: 13, top: 33, width: 11, height: 6, borderRadius: 3, backgroundColor: "#FFB7B2", opacity: 0.7 },
  blushRight: { position: "absolute", right: 13, top: 33, width: 11, height: 6, borderRadius: 3, backgroundColor: "#FFB7B2", opacity: 0.7 },
  dogTailWrapper: { position: "absolute", left: -2, bottom: 8, transformOrigin: "right center" },
  dogTail: { width: 22, height: 8, borderRadius: 4, backgroundColor: "#E2E8F0" },
});