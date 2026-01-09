import React, { createContext, useContext, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';

// --- Context ---
interface AlertDialogContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

// --- Components ---

interface AlertDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const AlertDialog = ({
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  children,
}: AlertDialogProps) => {
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
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

interface AlertDialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
  style?: ViewStyle;
}

const AlertDialogTrigger = ({ children, asChild, style }: AlertDialogTriggerProps) => {
  const context = useContext(AlertDialogContext);
  if (!context) throw new Error("AlertDialogTrigger must be used within AlertDialog");

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      onPress: (e: any) => {
        // @ts-ignore - calling original onPress if exists
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

// Portal is handled by Paper's Portal, but we wrap it to match API
const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

const AlertDialogOverlay = () => null; // Handled by Paper's Dialog dimming

interface AlertDialogContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const AlertDialogContent = ({ children, style }: AlertDialogContentProps) => {
  const context = useContext(AlertDialogContext);
  if (!context) throw new Error("AlertDialogContent must be used within AlertDialog");
  const theme = useTheme();

  return (
    <Portal>
      <Dialog
        visible={context.open}
        onDismiss={() => context.setOpen(false)}
        style={[{ backgroundColor: theme.colors.elevation.level3 }, style]}
      >
        <Dialog.Content style={styles.dialogContent}>
          {children}
        </Dialog.Content>
      </Dialog>
    </Portal>
  );
};

const AlertDialogHeader = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.header, style]}>{children}</View>
);

const AlertDialogTitle = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  const theme = useTheme();
  return (
    <Text variant="titleLarge" style={[{ color: theme.colors.onSurface, fontWeight: '600' }, style]}>
      {children}
    </Text>
  );
};

const AlertDialogDescription = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => {
  const theme = useTheme();
  return (
    <Text variant="bodyMedium" style={[{ color: theme.colors.onSurfaceVariant, marginTop: 8 }, style]}>
      {children}
    </Text>
  );
};

const AlertDialogFooter = ({ children, style }: { children: React.ReactNode; style?: ViewStyle }) => (
  <View style={[styles.footer, style]}>{children}</View>
);

interface AlertDialogActionProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

const AlertDialogAction = ({ children, onPress, style }: AlertDialogActionProps) => {
  const context = useContext(AlertDialogContext);
  const theme = useTheme();
  
  const handlePress = () => {
    onPress?.();
    context?.setOpen(false);
  };

  return (
    <Button 
      mode="contained" 
      onPress={handlePress} 
      style={[{ marginLeft: 8 }, style]}
      buttonColor={theme.colors.primary}
      textColor={theme.colors.onPrimary}
    >
      {children}
    </Button>
  );
};

interface AlertDialogCancelProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

const AlertDialogCancel = ({ children, onPress, style }: AlertDialogCancelProps) => {
  const context = useContext(AlertDialogContext);
  const theme = useTheme();

  const handlePress = () => {
    onPress?.();
    context?.setOpen(false);
  };

  return (
    <Button 
      mode="outlined" 
      onPress={handlePress} 
      style={[{ borderColor: theme.colors.outline }, style]}
      textColor={theme.colors.onSurface}
    >
      {children}
    </Button>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  dialogContent: {
    paddingHorizontal: 0,
    paddingBottom: 0,
    paddingTop: 0,
  },
  header: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 24,
  },
});

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};