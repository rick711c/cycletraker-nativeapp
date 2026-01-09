import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button as PaperButton, useTheme, MD3Theme } from 'react-native-paper';

// --- Types ---
type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ComponentProps<typeof PaperButton> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

const Button = React.forwardRef<any, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'default',
      children,
      style,
      labelStyle,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();
    const { mode, buttonColor, textColor, borderColor } = getVariantStyles(
      theme,
      variant,
    );
    const sizeStyles = getSizeStyles(size);

    return (
      <PaperButton
        ref={ref}
        mode={mode}
        buttonColor={buttonColor}
        textColor={textColor}
        style={[
          styles.base,
          borderColor ? { borderColor, borderWidth: 1 } : undefined,
          sizeStyles.button,
          style,
        ]}
        labelStyle={[
          styles.label,
          variant === 'link' && styles.link,
          sizeStyles.label,
          labelStyle,
        ]}
        {...props}
      >
        {children}
      </PaperButton>
    );
  },
);
Button.displayName = 'Button';

// --- Styles & Helpers ---

const styles = StyleSheet.create({
  base: {
    borderRadius: 6, // rounded-md
    justifyContent: 'center',
  },
  label: {
    // font-medium equivalent logic often handled by Paper theme, but we can enforce
    fontWeight: '500',
    letterSpacing: 0.5,
    marginVertical: 0, // Fix vertical alignment in fixed heights
    marginHorizontal: 0,
  },
  link: {
    textDecorationLine: 'underline',
  },
});

const getSizeStyles = (size: ButtonSize) => {
  switch (size) {
    case 'sm':
      return {
        button: { height: 36, paddingHorizontal: 12 }, // h-9 px-3
        label: { fontSize: 13, marginHorizontal: 8 },
      };
    case 'lg':
      return {
        button: { height: 44, paddingHorizontal: 32 }, // h-11 px-8
        label: { fontSize: 16, marginHorizontal: 16 },
      };
    case 'icon':
      return {
        button: { height: 40, width: 40, paddingHorizontal: 0 }, // h-10 w-10
        label: { marginHorizontal: 0 },
      };
    case 'default':
    default:
      return {
        button: { height: 40, paddingHorizontal: 16 }, // h-10 px-4
        label: { fontSize: 14, marginHorizontal: 12 },
      };
  }
};

const getVariantStyles = (theme: MD3Theme, variant: ButtonVariant) => {
  switch (variant) {
    case 'destructive':
      return {
        mode: 'contained' as const,
        buttonColor: theme.colors.error,
        textColor: theme.colors.onError,
      };
    case 'outline':
      return {
        mode: 'outlined' as const,
        buttonColor: theme.colors.background,
        textColor: theme.colors.onSurface, // accent-foreground logic
        borderColor: theme.colors.outline, // border-input
      };
    case 'secondary':
      return {
        mode: 'contained-tonal' as const,
        buttonColor: theme.colors.secondaryContainer,
        textColor: theme.colors.onSecondaryContainer,
      };
    case 'ghost':
      return {
        mode: 'text' as const,
        textColor: theme.colors.onSurface, // accent-foreground
      };
    case 'link':
      return {
        mode: 'text' as const,
        textColor: theme.colors.primary,
      };
    case 'default':
    default:
      return {
        mode: 'contained' as const,
        buttonColor: theme.colors.primary,
        textColor: theme.colors.onPrimary,
      };
  }
};

export { Button };
