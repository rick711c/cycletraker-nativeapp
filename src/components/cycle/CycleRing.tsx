import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Chip, useTheme } from 'react-native-paper';
import { cyclePhaseColors } from '../../theme/muiTheme';
import Svg, { Path, Circle } from 'react-native-svg';

export type CyclePhase = 'menstruation' | 'follicular' | 'ovulation' | 'luteal';


const phaseLabels: Record<CyclePhase, string> = {
  menstruation: 'Period',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
};

interface CycleRingProps {
  dayInCycle: number;
  cycleLength: number;
  currentPhase: CyclePhase;
  periodLength: number;
}

export function CycleRing({ 
  dayInCycle, 
  cycleLength, 
  currentPhase, 
  periodLength 
}: CycleRingProps) {
  const theme = useTheme();

  const progress = (dayInCycle / cycleLength) * 100;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          style={{ transform: [{ rotate: '-90deg' }] }}
        >
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

            return (
              <Path
                key={segment.phase}
                  d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={cyclePhaseColors[segment.phase]}
                  opacity={segment.phase === currentPhase ? 1 : 0.28}
              />
            );
          })}
            <Circle cx="50" cy="50" r="35" fill={theme.colors.surface} />
            <Circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={theme.colors.outline}
              strokeWidth="2"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
        </Svg>

        <View style={styles.centerContent}>
          <Text 
            variant="displayMedium" 
            style={{ fontWeight: '700', color: theme.colors.onSurface }}
          >
            {dayInCycle}
          </Text>
          <Text 
            variant="bodyMedium" 
            style={{ color: theme.colors.onSurfaceVariant, fontWeight: '500' }}
          >
            Day of cycle
          </Text>
          
          <Chip
            mode="flat"
            style={[
              styles.chip,
              // Use a subtle translucent tint based on the phase color; fall back to surfaceVariant
              { backgroundColor: `${(cyclePhaseColors[currentPhase] ?? theme.colors.primary)}20` }
            ]}
            textStyle={{
              color: cyclePhaseColors[currentPhase] ?? theme.colors.primary,
              fontWeight: '600',
              fontSize: 12,
            }}
            compact
          >
            {phaseLabels[currentPhase]}
          </Chip>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  ringContainer: {
    width: 208,
    height: 208,
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    marginTop: 8,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }
});