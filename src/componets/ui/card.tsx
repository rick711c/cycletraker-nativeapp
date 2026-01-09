import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

// --- Components ---

const Card = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => {
    const theme = useTheme();
    return (
      <View
        ref={ref}
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.elevation.level1, // bg-card
            borderColor: theme.colors.outlineVariant, // border
          },
          style,
        ]}
        {...props}
      />
    );
  },
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.header, style]} {...props} />
  ),
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<any, React.ComponentProps<typeof Text>>(
  ({ style, ...props }, ref) => {
    const theme = useTheme();
    return (
      <Text
        ref={ref}
        variant="titleLarge"
        style={[
          styles.title,
          { color: theme.colors.onSurface }, // text-card-foreground
          style,
        ]}
        {...props}
      />
    );
  },
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
  any,
  React.ComponentProps<typeof Text>
>(({ style, ...props }, ref) => {
  const theme = useTheme();
  return (
    <Text
      ref={ref}
      variant="bodyMedium"
      style={[
        styles.description,
        { color: theme.colors.onSurfaceVariant }, // text-muted-foreground
        style,
      ]}
      {...props}
    />
  );
});
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.content, style]} {...props} />
  ),
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => (
    <View ref={ref} style={[styles.footer, style]} {...props} />
  ),
);
CardFooter.displayName = 'CardFooter';

// --- Styles ---

const styles = StyleSheet.create({
  card: {
    borderRadius: 8, // rounded-lg
    borderWidth: 1, // border
    // shadow-sm equivalent
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  header: {
    flexDirection: 'column',
    padding: 24, // p-6
    gap: 6, // space-y-1.5 (approx 6px)
  },
  title: {
    fontWeight: '600', // font-semibold
    lineHeight: 24, // leading-none (tightened slightly for RN)
    letterSpacing: -0.25, // tracking-tight
  },
  description: {
    fontSize: 14, // text-sm
  },
  content: {
    padding: 24, // p-6
    paddingTop: 0, // pt-0
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center', // items-center
    padding: 24, // p-6
    paddingTop: 0, // pt-0
  },
});

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
