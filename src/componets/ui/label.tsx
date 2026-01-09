import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import { useTheme } from 'react-native-paper';

interface LabelProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

const Label = React.forwardRef<Text, LabelProps>(
  ({ children, style, ...props }, ref) => {
    const theme = useTheme();

    return (
      <Text
        ref={ref}
        style={[
          styles.label,
          { 
            color: theme.colors.onSurface,
            // peer-disabled:opacity-70 logic is usually handled by the parent controller 
            // passing a style or opacity, but we set a default color here.
          },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
Label.displayName = "Label";

const styles = StyleSheet.create({
  label: {
    fontSize: 14, // text-sm
    fontWeight: '500', // font-medium
    lineHeight: 20, // leading-none (approximate for RN to prevent cut-off)
    marginBottom: 6, // Common spacing for labels above inputs
  },
});

export { Label };