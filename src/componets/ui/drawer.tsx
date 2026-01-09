import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  ViewStyle,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';

// --- Context ---
interface DrawerContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

// --- Components ---

interface DrawerProps {
  shouldScaleBackground?: boolean; // Not applicable in simple RN implementation, kept for API compat
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Drawer = ({
  shouldScaleBackground = true,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: DrawerProps) => {
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
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};

const DrawerTrigger = ({
  children,
  asChild,
  style,
}: {
  children: React.ReactNode;
  asChild?: boolean;
  style?: ViewStyle;
}) => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('DrawerTrigger must be used within Drawer');

  const handlePress = () => context.setOpen(true);

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

const DrawerPortal = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const DrawerClose = React.forwardRef<
  any,
  { children?: React.ReactNode; asChild?: boolean; style?: ViewStyle }
>(({ children, asChild, style }, ref) => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('DrawerClose must be used within Drawer');

  const handlePress = () => context.setOpen(false);

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
    <TouchableOpacity onPress={handlePress} style={style} ref={ref}>
      {children}
    </TouchableOpacity>
  );
});
DrawerClose.displayName = 'DrawerClose';

const DrawerOverlay = () => null; // Handled by Modal backdrop

interface DrawerContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const DrawerContent = React.forwardRef<View, DrawerContentProps>(
  ({ children, style }, ref) => {
    const context = useContext(DrawerContext);
    const theme = useTheme();

    if (!context) throw new Error('DrawerContent must be used within Drawer');

    if (!context.open) return null;

    return (
      <Modal
        visible={context.open}
        transparent={true}
        animationType="slide"
        onRequestClose={() => context.setOpen(false)}
        statusBarTranslucent
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          {/* Backdrop Touch Handler */}
          <TouchableWithoutFeedback onPress={() => context.setOpen(false)}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>

          {/* Drawer Sheet */}
          <View
            ref={ref}
            style={[
              styles.content,
              {
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.outlineVariant,
              },
              style,
            ]}
          >
            {/* Handle Bar */}
            <View
              style={[
                styles.handle,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
            />

            {children}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  },
);
DrawerContent.displayName = 'DrawerContent';

const DrawerHeader = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => <View style={[styles.header, style]}>{children}</View>;
DrawerHeader.displayName = 'DrawerHeader';

const DrawerFooter = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => <View style={[styles.footer, style]}>{children}</View>;
DrawerFooter.displayName = 'DrawerFooter';

const DrawerTitle = React.forwardRef<any, React.ComponentProps<typeof Text>>(
  ({ children, style, ...props }, ref) => {
    const theme = useTheme();
    return (
      <Text
        ref={ref}
        variant="titleLarge"
        style={[
          {
            fontWeight: '600',
            color: theme.colors.onSurface,
            textAlign: 'center',
          },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  },
);
DrawerTitle.displayName = 'DrawerTitle';

const DrawerDescription = React.forwardRef<
  any,
  React.ComponentProps<typeof Text>
>(({ children, style, ...props }, ref) => {
  const theme = useTheme();
  return (
    <Text
      ref={ref}
      variant="bodyMedium"
      style={[
        { color: theme.colors.onSurfaceVariant, textAlign: 'center' },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
});
DrawerDescription.displayName = 'DrawerDescription';

// --- Styles ---

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // bg-black/80 equivalent
  },
  content: {
    width: '100%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingBottom: 20, // Safe area bottom padding approximation
    maxHeight: '90%', // Don't cover entire screen
  },
  handle: {
    width: 100,
    height: 8,
    borderRadius: 99,
    alignSelf: 'center',
    marginVertical: 12, // mt-4 approx
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 4, // gap-1.5
  },
  footer: {
    marginTop: 'auto',
    padding: 16,
    gap: 8, // gap-2
  },
});

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
