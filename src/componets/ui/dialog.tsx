import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import {
  Dialog as PaperDialog,
  Portal,
  Text,
  IconButton,
  useTheme,
} from 'react-native-paper';

// --- Context ---
interface DialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

// --- Components ---

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const Dialog = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: DialogProps) => {
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
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  style?: ViewStyle;
}

const DialogTrigger = ({ children, asChild, style }: DialogTriggerProps) => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogTrigger must be used within Dialog');

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onPress: (e: any) => {
        // @ts-ignore
        children.props.onPress?.(e);
        context.setOpen(true);
      },
    });
  }

  return (
    <TouchableOpacity
      style={style}
      onPress={() => context.setOpen(true)}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};

const DialogPortal = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);

const DialogOverlay = () => null; // Handled by Paper's dimming

const DialogClose = React.forwardRef<
  any,
  { children?: React.ReactNode; asChild?: boolean; style?: ViewStyle }
>(({ children, asChild, style }, ref) => {
  const context = useContext(DialogContext);
  if (!context) throw new Error('DialogClose must be used within Dialog');

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
DialogClose.displayName = 'DialogClose';

interface DialogContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
  closeIcon?: boolean;
}

const DialogContent = React.forwardRef<View, DialogContentProps>(
  ({ children, style, closeIcon = true }, ref) => {
    const context = useContext(DialogContext);
    const theme = useTheme();

    if (!context) throw new Error('DialogContent must be used within Dialog');

    return (
      <Portal>
        <PaperDialog
          visible={context.open}
          onDismiss={() => context.setOpen(false)}
          style={[
            { backgroundColor: theme.colors.elevation.level3, borderRadius: 8 },
            style,
          ]}
        >
          <PaperDialog.Content style={styles.content}>
            {children}
            {closeIcon && (
              <View style={styles.closeBtn}>
                <IconButton
                  icon="close"
                  size={20}
                  onPress={() => context.setOpen(false)}
                  iconColor={theme.colors.onSurfaceVariant}
                />
              </View>
            )}
          </PaperDialog.Content>
        </PaperDialog>
      </Portal>
    );
  },
);
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => <View style={[styles.header, style]}>{children}</View>;
DialogHeader.displayName = 'DialogHeader';

const DialogFooter = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => <View style={[styles.footer, style]}>{children}</View>;
DialogFooter.displayName = 'DialogFooter';

const DialogTitle = React.forwardRef<any, React.ComponentProps<typeof Text>>(
  ({ children, style, ...props }, ref) => {
    const theme = useTheme();
    return (
      <Text
        ref={ref}
        variant="headlineSmall"
        style={[
          { fontWeight: '600', color: theme.colors.onSurface, marginBottom: 8 },
          style,
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  },
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  any,
  React.ComponentProps<typeof Text>
>(({ children, style, ...props }, ref) => {
  const theme = useTheme();
  return (
    <Text
      ref={ref}
      variant="bodyMedium"
      style={[{ color: theme.colors.onSurfaceVariant }, style]}
      {...props}
    >
      {children}
    </Text>
  );
});
DialogDescription.displayName = 'DialogDescription';

// --- Styles ---

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    padding: 24, // Standard dialog padding
    position: 'relative',
  },
  header: {
    marginBottom: 12,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  closeBtn: {
    position: 'absolute',
    right: -10, // Adjust for icon padding
    top: -10,
  },
});

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
