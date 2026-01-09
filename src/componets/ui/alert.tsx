import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Text, useTheme, MD3Theme } from 'react-native-paper';

// --- Types ---
type AlertVariant = 'default' | 'destructive';

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
  style?: ViewStyle;
}

const Alert = React.forwardRef<View, AlertProps>(
  ({ variant = 'default', children, style }, ref) => {
    const theme = useTheme();
    const styles = getStyles(theme, variant);

    return (
      <View
        ref={ref}
        style={[styles.container, style]}
        accessibilityRole="alert"
      >
        {children}
      </View>
    );
  }
);
Alert.displayName = "Alert";

interface AlertTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const AlertTitle = React.forwardRef<React.ElementRef<typeof Text>, AlertTitleProps>(
  ({ children, style }, ref) => {
    const theme = useTheme();
    // In the context of Alert, we might want to inherit color, but Text usually needs explicit color in RN if overriding
    // We'll rely on the parent container's context or just use standard theme colors which line up with variants
    return (
      <Text
        ref={ref}
        variant="titleMedium"
        style={[{ fontWeight: '600', marginBottom: 4, color: theme.colors.onSurface }, style]}
      >
        {children}
      </Text>
    );
  }
);
AlertTitle.displayName = "AlertTitle";

interface AlertDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const AlertDescription = React.forwardRef<React.ElementRef<typeof Text>, AlertDescriptionProps>(
  ({ children, style }, ref) => {
    const theme = useTheme();
    return (
      <Text
        ref={ref}
        variant="bodyMedium"
        style={[{ color: theme.colors.onSurfaceVariant }, style]}
      >
        {children}
      </Text>
    );
  }
);
AlertDescription.displayName = "AlertDescription";

// --- Styles & Helper ---

const getStyles = (theme: MD3Theme, variant: AlertVariant) => {
  const isDestructive = variant === 'destructive';

  return StyleSheet.create({
    container: {
      width: '100%',
      borderRadius: 8, // rounded-lg
      borderWidth: 1, // border
      padding: 16, // p-4
      // relative positioning is default in RN
      
      // Variant logic
      backgroundColor: isDestructive ? theme.colors.errorContainer : theme.colors.background,
      borderColor: isDestructive ? theme.colors.error : theme.colors.outline,
      
      // Note: In RN we can't do exact CSS selectors like [&>svg]:absolute.
      // If adding an icon, the user should position it using Flexbox in the children.
      flexDirection: 'column',
    },
  });
};

export { Alert, AlertTitle, AlertDescription };