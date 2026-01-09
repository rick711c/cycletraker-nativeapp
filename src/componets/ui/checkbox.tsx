import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';

interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

const Checkbox = React.forwardRef<View, CheckboxProps>(
  ({ checked = false, onCheckedChange, disabled = false, style }, ref) => {
    const theme = useTheme();
    const primary = theme.colors.primary;
    const onPrimary = theme.colors.onPrimary;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => !disabled && onCheckedChange?.(!checked)}
        disabled={disabled}
        // Increase touch area without changing visual size
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
        style={[
            styles.root,
            { 
                borderColor: primary,
                backgroundColor: checked ? primary : 'transparent',
                opacity: disabled ? 0.5 : 1
            },
            style
        ]}
        ref={ref}
      >
        {checked && (
          <Icon source="check" size={12} color={onPrimary} />
        )}
      </TouchableOpacity>
    );
  }
);
Checkbox.displayName = "Checkbox";

const styles = StyleSheet.create({
  root: {
    width: 16, // h-4 (16px)
    height: 16, // w-4 (16px)
    borderRadius: 4, // rounded-sm (approx 4px in RN usually looks better than 2px)
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export { Checkbox };