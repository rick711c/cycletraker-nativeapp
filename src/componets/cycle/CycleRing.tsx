import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G } from 'react-native-svg';
import { Text } from 'react-native-paper';

// --- Types ---
export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';

interface CycleRingProps {
  dayInCycle: number;
  cycleLength: number;
  currentPhase: CyclePhase;
  periodLength: number;
}

// --- Constants ---
// Colors mapped from standard shadcn-ui CSS variables
const PHASE_COLORS: Record<CyclePhase, string> = {
  menstruation: '#e11d48', // primary
  follicular: '#0ea5e9',   // chart-3
  ovulation: '#22c55e',    // chart-2
  luteal: '#eab308',       // chart-4
};

const PHASE_LABELS: Record<CyclePhase, string> = {
  menstruation: 'Period',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
};

export function CycleRing({ dayInCycle, cycleLength, currentPhase, periodLength }: CycleRingProps) {
  const progress = (dayInCycle / cycleLength) * 100;
  
  // Radius calculations based on viewBox 0 0 100 100
  const radius = 45; 
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Memoized logic (unchanged from original)
  const phases = useMemo(() => {
    const ovulationDay = cycleLength - 14;
    return [
      { phase: 'menstruation' as CyclePhase, start: 0, end: periodLength / cycleLength },
      { phase: 'follicular' as CyclePhase, start: periodLength / cycleLength, end: (ovulationDay - 1) / cycleLength },
      { phase: 'ovulation' as CyclePhase, start: (ovulationDay - 1) / cycleLength, end: (ovulationDay + 3) / cycleLength },
      { phase: 'luteal' as CyclePhase, start: (ovulationDay + 3) / cycleLength, end: 1 },
    ];
  }, [cycleLength, periodLength]);

  return (
    <View style={styles.container}>
      <View style={styles.ringContainer}>
        {/* SVG Container - Rotated -90deg to match original transform */}
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          style={styles.svg}
        >
          <G rotation="-90" origin="50, 50">
            {/* Background segments */}
            {phases.map((segment) => {
              const startAngle = segment.start * 360;
              const endAngle = segment.end * 360;
              const sweepAngle = endAngle - startAngle;
              
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = 50 + 45 * Math.cos(startRad);
              const y1 = 50 + 45 * Math.sin(startRad);
              const x2 = 50 + 45 * Math.cos(endRad);
              const y2 = 50 + 45 * Math.sin(endRad);
              
              const largeArcFlag = sweepAngle > 180 ? 1 : 0;
              
              const opacity = segment.phase === currentPhase ? 1 : 0.3;

              return (
                <Path
                  key={segment.phase}
                  d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={PHASE_COLORS[segment.phase]}
                  fillOpacity={opacity}
                />
              );
            })}

            {/* Inner circle (creates the donut hole effect) */}
            {/* Using a solid color that matches your app background (assumed white/card) */}
            <Circle cx="50" cy="50" r="35" fill="white" />

            {/* Progress indicator */}
            <Circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#000000" // foreground color
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>

        {/* Center content - Absolute positioning overlay */}
        <View style={styles.centerContent}>
          <Text variant="displayMedium" style={styles.dayText}>
            {dayInCycle}
          </Text>
          <Text variant="labelMedium" style={styles.subText}>
            Day of cycle
          </Text>
          
          <View 
            style={[
              styles.badge, 
              { 
                backgroundColor: `${PHASE_COLORS[currentPhase]}20`, // hex transparency approximation
              }
            ]}
          >
            <Text 
              style={[
                styles.badgeText,
                { color: PHASE_COLORS[currentPhase] }
              ]}
            >
              {PHASE_LABELS[currentPhase]}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // w-52 h-52 equates to roughly 208 logical pixels
    width: 208,
    height: 208,
    alignItems: 'center',
    justifyContent: 'center',
    // alignSelf: 'center', // optional: to center in parent
  },
  ringContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  dayText: {
    fontWeight: 'bold',
    // color: 'hsl(var(--foreground))', // Handle via Theme or explicit color
  },
  subText: {
    color: '#64748b', // muted-foreground
    fontWeight: '500',
  },
  badge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999, // rounded-full
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  }
});