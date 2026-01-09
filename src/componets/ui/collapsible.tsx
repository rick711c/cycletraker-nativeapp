import React, { useState, createContext, useContext, useEffect } from 'react';
import { View, TouchableOpacity, LayoutAnimation, Platform, UIManager, ViewStyle } from 'react-native';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Context ---
interface CollapsibleContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
}

const CollapsibleContext = createContext<CollapsibleContextType | undefined>(undefined);

// --- Components ---

interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

const Collapsible = React.forwardRef<View, CollapsibleProps>(
  ({ open: controlledOpen, defaultOpen = false, onOpenChange, disabled = false, children, style }, ref) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
    
    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;

    const handleOpenChange = (newOpen: boolean) => {
      // Trigger animation before state update
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      
      if (controlledOpen === undefined) {
        setUncontrolledOpen(newOpen);
      }
      onOpenChange?.(newOpen);
    };

    return (
      <CollapsibleContext.Provider 
        value={{ 
          open, 
          onOpenChange: handleOpenChange, 
          disabled 
        }}
      >
        <View ref={ref} style={style}>
          {children}
        </View>
      </CollapsibleContext.Provider>
    );
  }
);
Collapsible.displayName = "Collapsible";

interface CollapsibleTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  asChild?: boolean; 
}

const CollapsibleTrigger = React.forwardRef<any, CollapsibleTriggerProps>(
  ({ children, style, asChild }, ref) => {
    const context = useContext(CollapsibleContext);
    if (!context) throw new Error("CollapsibleTrigger must be used within Collapsible");

    const handlePress = () => {
      if (!context.disabled) {
        context.onOpenChange(!context.open);
      }
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement, {
        onPress: handlePress,
        disabled: context.disabled,
      });
    }

    return (
      <TouchableOpacity
        ref={ref}
        onPress={handlePress}
        disabled={context.disabled}
        activeOpacity={0.7}
        style={style}
      >
        {children}
      </TouchableOpacity>
    );
  }
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

interface CollapsibleContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const CollapsibleContent = React.forwardRef<View, CollapsibleContentProps>(
  ({ children, style }, ref) => {
    const context = useContext(CollapsibleContext);
    if (!context) throw new Error("CollapsibleContent must be used within Collapsible");

    if (!context.open) {
      return null;
    }

    return (
      <View ref={ref} style={style}>
        {children}
      </View>
    );
  }
);
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };