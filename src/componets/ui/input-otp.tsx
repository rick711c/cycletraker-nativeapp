import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  ViewStyle, 
  Animated,
  TextInputProps 
} from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';

// --- Context ---
interface InputOTPContextValue {
  value: string;
  maxLength: number;
  isFocused: boolean;
}

const InputOTPContext = createContext<InputOTPContextValue | undefined>(undefined);

// --- Components ---

interface InputOTPProps extends Omit<TextInputProps, 'style'> {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  containerStyle?: ViewStyle;
  style?: ViewStyle; // Applied to the container of slots
  children: React.ReactNode;
}

const InputOTP = React.forwardRef<View, InputOTPProps>(
  ({ value, onChange, maxLength, containerStyle, style, children, ...props }, ref) => {
    const inputRef = useRef<TextInput>(null);
    const [isFocused, setIsFocused] = useState(false);

    const handlePress = () => {
      inputRef.current?.focus();
    };

    return (
      <InputOTPContext.Provider value={{ value, maxLength, isFocused }}>
        <View ref={ref} style={[styles.container, containerStyle]}>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChange}
            maxLength={maxLength}
            style={styles.hiddenInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            keyboardType="number-pad"
            caretHidden
            {...props}
          />
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={handlePress}
            style={[styles.slotsContainer, style]}
          >
            {children}
          </TouchableOpacity>
        </View>
      </InputOTPContext.Provider>
    );
  }
);
InputOTP.displayName = "InputOTP";

const InputOTPGroup = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, children, ...props }, ref) => {
    return (
      <View ref={ref} style={[styles.group, style]} {...props}>
        {children}
      </View>
    );
  }
);
InputOTPGroup.displayName = "InputOTPGroup";

interface InputOTPSlotProps {
  index: number;
  style?: ViewStyle;
}

const InputOTPSlot = React.forwardRef<View, InputOTPSlotProps>(
  ({ index, style, ...props }, ref) => {
    const context = useContext(InputOTPContext);
    const theme = useTheme();

    if (!context) throw new Error("InputOTPSlot must be used within InputOTP");

    const { value, maxLength, isFocused } = context;
    const char = value[index] || "";
    const isActive = isFocused && (index === value.length || (index === maxLength - 1 && value.length === maxLength));

    // Fake Caret Animation
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (isActive) {
        Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
            Animated.delay(500),
            Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
          ])
        ).start();
      } else {
        opacity.setValue(0);
      }
    }, [isActive]);

    return (
      <View
        ref={ref}
        style={[
          styles.slot,
          { 
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.background 
          },
          // Logic for "attached" borders (mimicking border-y border-r first:border-l)
          // We assume slots are placed in a row with negative margins or handled by Group.
          // Here we use a self-contained style that looks good standalone or grouped.
          isActive && { 
            borderColor: theme.colors.primary, 
            borderWidth: 2, 
            zIndex: 10 
          },
          style
        ]}
        {...props}
      >
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          {char}
        </Text>
        {isActive && (
          <View style={styles.caretWrapper}>
            <Animated.View 
              style={[
                styles.caret, 
                { backgroundColor: theme.colors.onSurface, opacity } 
              ]} 
            />
          </View>
        )}
      </View>
    );
  }
);
InputOTPSlot.displayName = "InputOTPSlot";

const InputOTPSeparator = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, ...props }, ref) => {
    const theme = useTheme();
    return (
      <View ref={ref} style={[styles.separator, style]} {...props}>
        <Icon source="circle-medium" size={16} color={theme.colors.onSurface} />
      </View>
    );
  }
);
InputOTPSeparator.displayName = "InputOTPSeparator";

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hiddenInput: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0,
    zIndex: 1,
  },
  slotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // Default gap for un-grouped slots
  },
  group: {
    flexDirection: 'row',
    alignItems: 'center',
    // To mimic the attached look:
    // We can remove gap and handle borders, or just let them float.
    // Shadcn uses border collapse logic. In RN, negative margin is easiest for connected borders.
    // However, without knowing if children are slots or not, we'll stick to flex row.
  },
  slot: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    marginHorizontal: 4,
  },
  caretWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  caret: {
    width: 2,
    height: 20,
  }
});

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };