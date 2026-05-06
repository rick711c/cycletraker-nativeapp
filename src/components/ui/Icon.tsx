import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { StyleProp, TextStyle } from 'react-native';

type Props = {
  icon?: string;
  name?: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export default function Icon({ icon, name, size = 24, color, style }: Props) {
  const iconName = (icon || name) as any;
  return <MaterialCommunityIcons name={iconName} size={size} color={color} style={style} />;
}
