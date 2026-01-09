import React, { createContext, useContext, useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  ViewStyle,
  Platform,
} from 'react-native';
import { useTheme } from 'react-native-paper';

// --- Context ---
interface HoverCardContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const HoverCardContext = createContext<HoverCardContextType | undefined>(
  undefined,
);

// --- Components ---

interface HoverCardProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const HoverCard = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: HoverCardProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen);
    }
  };

  return (
    <HoverCardContext.Provider value={{ open, setOpen }}>
      {children}
    </HoverCardContext.Provider>
  );
};

interface HoverCardTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  style?: ViewStyle;
}

const HoverCardTrigger = ({
  children,
  asChild,
  style,
}: HoverCardTriggerProps) => {
  const context = useContext(HoverCardContext);
  if (!context)
    throw new Error('HoverCardTrigger must be used within HoverCard');

  const handlePress = () => context.setOpen(!context.open);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onPress: (e: any) => {
        // @ts-ignore
        children.props.onPress?.(e);
        handlePress();
      },
    });
  }

  return (
    <TouchableOpacity style={style} onPress={handlePress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
};

interface HoverCardContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  align?: 'center' | 'start' | 'end'; // Kept for API compatibility, though positioning logic is simplified here
  sideOffset?: number;
}

const HoverCardContent = React.forwardRef<View, HoverCardContentProps>(
  ({ children, style, align = 'center', sideOffset = 4 }, ref) => {
    const context = useContext(HoverCardContext);
    const theme = useTheme();

    if (!context)
      throw new Error('HoverCardContent must be used within HoverCard');

    if (!context.open) return null;

    // Note: True relative positioning (appearing next to trigger) requires coordinate measurement.
    // For this implementation, we render a centered modal overlay which is common for mobile "details" cards.
    return (
      <Modal
        visible={context.open}
        transparent={true}
        animationType="fade"
        onRequestClose={() => context.setOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => context.setOpen(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View
                ref={ref}
                style={[
                  styles.content,
                  {
                    backgroundColor: theme.colors.elevation.level3, // bg-popover
                    borderColor: theme.colors.outlineVariant,
                  },
                  style,
                ]}
              >
                {children}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    );
  },
);
HoverCardContent.displayName = 'HoverCardContent';

// --- Styles ---

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)', // Light dimming
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: 256, // w-64
    borderRadius: 6, // rounded-md
    borderWidth: 1,
    padding: 16, // p-4
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export { HoverCard, HoverCardTrigger, HoverCardContent };
