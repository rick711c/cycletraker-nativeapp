import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';

// --- Types ---
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}

function Badge({ variant = 'default', children, style }: BadgeProps) {
  const theme = useTheme();
  const styles = getBadgeStyles(theme, variant);

  return (
    <View style={[styles.container, style]}>
      {typeof children === 'string' ? (
        <Text style={styles.text}>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
}

// --- Styles & Helper ---

const getBadgeStyles = (theme: MD3Theme, variant: BadgeVariant) => {
  const baseContainer: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 100, // rounded-full
    paddingHorizontal: 10, // px-2.5
    paddingVertical: 2, // py-0.5
    borderWidth: 1, // border
    borderColor: 'transparent', // default border transparent
  };

  const baseText: TextStyle = {
    fontSize: 12, // text-xs
    fontWeight: '600', // font-semibold
    lineHeight: 16,
  };

  switch (variant) {
    case 'secondary':
      return StyleSheet.create({
        container: {
          ...baseContainer,
          backgroundColor: theme.colors.secondaryContainer, // bg-secondary
        },
        text: {
          ...baseText,
          color: theme.colors.onSecondaryContainer, // text-secondary-foreground
        },
      });
    case 'destructive':
      return StyleSheet.create({
        container: {
          ...baseContainer,
          backgroundColor: theme.colors.error, // bg-destructive
        },
        text: {
          ...baseText,
          color: theme.colors.onError, // text-destructive-foreground
        },
      });
    case 'outline':
      return StyleSheet.create({
        container: {
          ...baseContainer,
          backgroundColor: 'transparent',
          borderColor: theme.colors.outline, // border visible
        },
        text: {
          ...baseText,
          color: theme.colors.onSurface, // text-foreground
        },
      });
    case 'default':
    default:
      return StyleSheet.create({
        container: {
          ...baseContainer,
          backgroundColor: theme.colors.primary, // bg-primary
        },
        text: {
          ...baseText,
          color: theme.colors.onPrimary, // text-primary-foreground
        },
      });
  }
};

export { Badge };