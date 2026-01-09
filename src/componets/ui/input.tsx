import * as React from "react";
import { 
  TextInput, 
  StyleSheet, 
  TextInputProps, 
  NativeSyntheticEvent, 
  TextInputFocusEventData 
} from "react-native";
import { useTheme } from "react-native-paper";

export interface InputProps extends TextInputProps {}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ style, onFocus, onBlur, placeholderTextColor, ...props }, ref) => {
    const theme = useTheme();
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            borderColor: isFocused ? theme.colors.primary : theme.colors.outline,
            backgroundColor: theme.colors.background,
            color: theme.colors.onSurface,
          },
          style,
        ]}
        placeholderTextColor={placeholderTextColor || theme.colors.onSurfaceDisabled}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const styles = StyleSheet.create({
  input: {
    height: 40, // h-10
    width: "100%", // w-full
    borderRadius: 6, // rounded-md
    borderWidth: 1, // border
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-2 (adjusts based on font size usually, but explicit here)
    fontSize: 14, // text-sm / text-base (16px) -> 14px for mobile standard often
  },
});

export { Input };