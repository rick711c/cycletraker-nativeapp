import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withSpring,
  interpolate,
  useAnimatedProps
} from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, useTheme } from 'react-native-paper';
// import { CyclePhase } from '@/src/types/insight';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface AnimeGrasslandCanvasProps {
  dayInCycle: number;
  cycleLength: number;
  currentPhase: string; // Or string, depending on your type definitions
  periodLength: number;
  nextPeriodDate: string;
}


// ==========================================
// 🌸 HIGH-PERFORMANCE FLOATING PETAL LAYER
// ==========================================
function FloatingPetal({ index, accentColor }: { index: number; accentColor: string }) {
  const startX = (SCREEN_WIDTH / 5) * (index % 5) + Math.random() * 25;
  const startY = 60 + (index * 55);

  const driftX = useSharedValue(0);
  const fallY = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    driftX.value = withRepeat(
      withSequence(
        withTiming(20, { duration: 3000 + index * 200 }),
        withTiming(-20, { duration: 3000 + index * 200 })
      ),
      -1,
      true
    );
    fallY.value = withRepeat(
      withTiming(120, { duration: 6000 + index * 400 }),
      -1,
      true
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 9000 + index * 500 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedProps(() => ({
    transform: [
      { translateX: startX + driftX.value },
      { translateY: startY + fallY.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: interpolate(fallY.value, [0, 20, 100, 120], [0, 0.45, 0.45, 0])
  }));

  return (
    <Animated.View style={[styles.petalAbsolute, animatedStyle]}>
      <MaterialCommunityIcons name="flower-poppy" size={13 + (index % 3) * 3} color={`${accentColor}55`} />
    </Animated.View>
  );
}

// ==========================================
// 🐕 ULTRA-PREMIUM INTERACTIVE PUPPY
// ==========================================
function AdvancedPuppy({ isDark, landscapeFill1, landscapeFill2, puppyColors }: {
  isDark: boolean;
  landscapeFill1: string;
  landscapeFill2: string;
  puppyColors: {
    face: string;
    ear: string;
    eye: string;
    nose: string;
    mouth: string;
    faceBorder: string;
  };
}) {
  const breathe = useSharedValue(0);
  const tailWag = useSharedValue(0);
  const eyeBlink = useSharedValue(1);
  const earWiggle = useSharedValue(0);

  useEffect(() => {
    breathe.value = withRepeat(withTiming(1, { duration: 1300 }), -1, true);
    tailWag.value = withRepeat(withSequence(withTiming(-10, { duration: 200 }), withTiming(10, { duration: 200 })), -1, true);

    const earTimer = setInterval(() => {
      earWiggle.value = withSequence(withSpring(6), withSpring(-3), withSpring(0));
    }, 4000);

    const blinkTimer = setInterval(() => {
      eyeBlink.value = withSequence(withTiming(0.1, { duration: 80 }), withTiming(1, { duration: 100 }));
    }, 5000);

    return () => {
      clearInterval(earTimer);
      clearInterval(blinkTimer);
    };
  }, []);

  const bodyStyle = useAnimatedProps(() => ({
    transform: [{ translateY: interpolate(breathe.value, [0, 1], [0, -2.5]) }]
  }));
  const tailStyle = useAnimatedProps(() => ({ transform: [{ rotate: `${tailWag.value}deg` }] }));
  const leftEarStyle = useAnimatedProps(() => ({ transform: [{ rotate: `${-15 + earWiggle.value}deg` }] }));
  const rightEarStyle = useAnimatedProps(() => ({ transform: [{ rotate: `${15 - earWiggle.value}deg` }] }));
  const eyeStyle = useAnimatedProps(() => ({ transform: [{ scaleY: eyeBlink.value }] }));

  return (
    <View style={styles.puppyWrapper}>
      <View style={styles.landscapeVectorContainer}>
        <Svg width={SCREEN_WIDTH} height={60} viewBox={`0 0 ${SCREEN_WIDTH} 60`} fill="none">
          <Path d={`M0 30 Q ${SCREEN_WIDTH * 0.3} 10, ${SCREEN_WIDTH * 0.7} 22 T ${SCREEN_WIDTH} 15 L ${SCREEN_WIDTH} 60 L 0 60 Z`} fill={landscapeFill1} />
          <Path d={`M0 42 Q ${SCREEN_WIDTH * 0.2} 25, ${SCREEN_WIDTH * 0.5} 36 T ${SCREEN_WIDTH} 30 L ${SCREEN_WIDTH} 60 L 0 60 Z`} fill={landscapeFill2} />
        </Svg>
      </View>

      <Animated.View style={[styles.puppyFrame, bodyStyle]}>
        <Animated.View style={[styles.puppyTail, tailStyle, { backgroundColor: puppyColors.ear }]} />
        <Animated.View style={[styles.puppyEarL, leftEarStyle, { backgroundColor: puppyColors.ear }]} />
        <Animated.View style={[styles.puppyEarR, rightEarStyle, { backgroundColor: puppyColors.ear }]} />
        <View style={[
          styles.puppyFace,
          {
            backgroundColor: puppyColors.face,
            borderWidth: isDark ? 0 : 1.5,
            borderColor: puppyColors.faceBorder,
          },
        ]}>
          <Animated.View style={[styles.puppyEyeL, eyeStyle, { backgroundColor: puppyColors.eye }]} />
          <Animated.View style={[styles.puppyEyeR, eyeStyle, { backgroundColor: puppyColors.eye }]} />
          <View style={styles.puppySnout}>
            <View style={[styles.puppyNose, { backgroundColor: puppyColors.nose }]} />
            <View style={[styles.puppyMouth, { backgroundColor: puppyColors.mouth }]} />
          </View>
          <View style={styles.blushNodeL} />
          <View style={styles.blushNodeR} />
        </View>
      </Animated.View>
    </View>
  );
}

export function AnimeGrasslandCanvas({ dayInCycle,
  cycleLength,
  currentPhase,
  periodLength,
  nextPeriodDate }: AnimeGrasslandCanvasProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const accent = theme.colors.primary;
  const accentGlow = isDark ? '#C2185B' : '#AD1457';

  // Theme-derived color palette
  const textPrimary = theme.colors.onBackground;
  const textSecondary = theme.colors.onSurfaceVariant;
  const containerBg = theme.colors.background;
  const metricsStackBg = theme.colors.surface;

  // Ring track uses subtle contrast against the background
  const ringTrackColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.06)';

  // Pill styling adapts to theme
  const pillBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';
  const pillBorder = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.06)';

  // Landscape SVG fills — subtle rolling hills that blend into the background
  // Light: use primaryContainer (#FDF2F7) tones for a soft pink-tinted landscape
  // Dark: keep the original deep charcoal tones
  const landscapeFill1 = isDark ? '#070709' : theme.colors.primaryContainer;
  const landscapeFill2 = isDark ? '#0D0D0F' : theme.colors.surfaceVariant;

  // Puppy colors adapt so it's visible on any background
  const puppyColors = {
    face: isDark ? '#FFFFFF' : '#FFFFFF',
    ear: isDark ? '#E5E5EA' : '#D4D4D6',
    eye: isDark ? '#1C1C1E' : '#18181B',
    nose: isDark ? '#1C1C1E' : '#18181B',
    mouth: isDark ? '#1C1C1E' : '#18181B',
    faceBorder: isDark ? 'transparent' : theme.colors.outline,
  };

  const ringProgress = useSharedValue(0);
  const glowPulse = useSharedValue(1);

  useEffect(() => {
    ringProgress.value = withTiming(0.75, { duration: 1400 });
    glowPulse.value = withRepeat(withTiming(1.05, { duration: 1800 }), -1, true);
  }, []);

  const RADIUS = 84;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const animatedRing = useAnimatedProps(() => ({ strokeDashoffset: CIRCUMFERENCE * (1 - ringProgress.value) }));
  const animatedGlow = useAnimatedProps(() => ({
    transform: [{ scale: glowPulse.value }],
    opacity: interpolate(glowPulse.value, [1, 1.05], [0.25, 0.5])
  }));

  return (
    <View style={[styles.container, { backgroundColor: containerBg }]}>
      {Array.from({ length: 5 }).map((_, idx) => <FloatingPetal key={idx} index={idx} accentColor={accent} />)}

      <View style={styles.header}>
        <View style={styles.logoRow}>
          <MaterialCommunityIcons name="flower-tulip" size={24} color={accent} style={[styles.glowLogo, { shadowColor: accent }]} />
          <Text style={[styles.logoText, { color: textPrimary }]}>Flora</Text>
        </View>
        <View style={styles.dateRow}>
          <Text style={[styles.dateLabel, { color: textSecondary }]}>Today</Text>
          <Text style={[styles.dateValue, { color: textPrimary }]}>Tue, Jun 23</Text>
        </View>
      </View>

      <View style={styles.dashboardContainer}>
        <View style={styles.ringFrame}>
          <Animated.View style={[styles.ambientGlow, animatedGlow, { shadowColor: accent }]} />
          <Svg width={200} height={200} viewBox="0 0 200 200" style={styles.svgRotate}>
            <Defs>
              <SvgGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor={accent} />
                <Stop offset="100%" stopColor={accentGlow} />
              </SvgGradient>
            </Defs>
            <Circle cx="105" cy="105" r={RADIUS} stroke={ringTrackColor} strokeWidth={6} fill="none" />
            <AnimatedCircle cx="105" cy="105" r={RADIUS} stroke="url(#accentGrad)" strokeWidth={6} fill="none" strokeDasharray={CIRCUMFERENCE} animatedProps={animatedRing} strokeLinecap="round" />
          </Svg>

          <MaterialCommunityIcons name="flower" size={24} color="#FF7EA5" style={[styles.sakura, { top: 10, right: 24 }]} />
          <MaterialCommunityIcons name="flower" size={18} color={accent} style={[styles.sakura, { bottom: 24, left: 8, shadowColor: accent }]} />

          <View style={[
            styles.metricsStack,
            {
              backgroundColor: metricsStackBg,
              borderWidth: isDark ? 0 : 1,
              borderColor: isDark ? 'transparent' : theme.colors.outline,
            },
          ]}>
            <Text style={[styles.metricLabel, { color: textSecondary }]}>NEXT PERIOD</Text>
            <Text style={[styles.metricNumber, { color: textPrimary }]}>30</Text>
            <Text style={[styles.metricMonth, { color: textSecondary }]}>July 2026</Text>
            <View style={[styles.dotSeparator, { backgroundColor: accent }]} />
            <Text style={[styles.metricCountdown, { color: textSecondary }]}>5 days left</Text>
          </View>
        </View>
      </View>

      <View style={styles.pillRow}>
        <View style={[styles.pillContainer, { backgroundColor: pillBg, borderColor: pillBorder }]}>
          <Text style={[styles.pillText, { color: textSecondary }]}>Day 1 of cycle</Text>
        </View>
        <View style={[styles.pillContainer, { backgroundColor: accent, borderColor: accent }]}>
          <Text style={[styles.pillText, { color: '#FFF', fontWeight: '800' }]}>MENSTRUATION</Text>
        </View>
      </View>

      <AdvancedPuppy
        isDark={isDark}
        landscapeFill1={landscapeFill1}
        landscapeFill2={landscapeFill2}
        puppyColors={puppyColors}
      />
    </View>
  );
}

// Structural styles only — all colors applied inline via theme
const styles = StyleSheet.create({
  container: { width: '100%', height: 440, position: 'relative', overflow: 'hidden' },
  petalAbsolute: { position: 'absolute', zIndex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, width: '100%', zIndex: 10 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  glowLogo: { shadowRadius: 8, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0 } },
  logoText: { fontSize: 24, fontWeight: '900', marginLeft: 6, letterSpacing: -0.5 },
  dateRow: { alignItems: 'flex-end' },
  dateLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase' },
  dateValue: { fontSize: 13, fontWeight: '700', marginTop: 1 },
  dashboardContainer: { alignItems: 'center', marginTop: 18 },
  ringFrame: { width: 200, height: 200, position: 'relative', alignItems: 'center', justifyContent: 'center' },
  ambientGlow: { position: 'absolute', width: 168, height: 168, borderRadius: 84, shadowRadius: 20, shadowOpacity: 0.7, shadowOffset: { width: 0, height: 0 } },
  svgRotate: { transform: [{ rotate: '-90deg' }] },
  sakura: { position: 'absolute', zIndex: 5, shadowRadius: 4, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 1 } },
  metricsStack: { position: 'absolute', alignItems: 'center', justifyContent: 'center', width: 164, height: 164, borderRadius: 82 },
  metricLabel: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  metricNumber: { fontSize: 52, fontWeight: '900', lineHeight: 54, marginVertical: 1 },
  metricMonth: { fontSize: 13, fontWeight: '700' },
  dotSeparator: { width: 4, height: 4, borderRadius: 2, marginVertical: 6 },
  metricCountdown: { fontSize: 11, fontWeight: '600' },
  pillRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 16, zIndex: 12 },
  pillContainer: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  pillText: { fontSize: 11, fontWeight: '600' },
  puppyWrapper: { width: SCREEN_WIDTH, height: 95, position: 'relative', alignItems: 'center', justifyContent: 'flex-end' },
  landscapeVectorContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 2 },
  puppyFrame: { width: 84, height: 65, alignItems: 'center', justifyContent: 'flex-end', zIndex: 4, position: 'relative' },
  puppyFace: { width: 76, height: 60, borderRadius: 30, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  puppyEarL: { position: 'absolute', left: -3, top: 8, width: 12, height: 28, borderRadius: 6, transformOrigin: 'top center' },
  puppyEarR: { position: 'absolute', right: -3, top: 8, width: 12, height: 28, borderRadius: 6, transformOrigin: 'top center' },
  puppyEyeL: { position: 'absolute', left: 22, top: 22, width: 5.5, height: 5.5, borderRadius: 2.75 },
  puppyEyeR: { position: 'absolute', right: 22, top: 22, width: 5.5, height: 5.5, borderRadius: 2.75 },
  puppySnout: { position: 'absolute', bottom: 18, alignItems: 'center' },
  puppyNose: { width: 7, height: 4.5, borderRadius: 2 },
  puppyMouth: { width: 1, height: 3, marginTop: 1 },
  blushNodeL: { position: 'absolute', left: 12, top: 28, width: 9, height: 4, borderRadius: 2, backgroundColor: '#FFB7B2', opacity: 0.6 },
  blushNodeR: { position: 'absolute', right: 12, top: 28, width: 9, height: 4, borderRadius: 2, backgroundColor: '#FFB7B2', opacity: 0.6 },
  puppyTail: { position: 'absolute', left: 4, bottom: 2, width: 18, height: 6, borderRadius: 3, transformOrigin: 'right center' }
});