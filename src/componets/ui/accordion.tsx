import React, { createContext, useContext, useState } from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  LayoutAnimation, 
  Platform, 
  UIManager, 
  ViewStyle, 
} from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Types ---
type AccordionType = 'single' | 'multiple';

interface AccordionContextType {
  type: AccordionType;
  value: string | string[] | undefined;
  onValueChange: (value: string) => void;
  collapsible?: boolean;
}

interface AccordionItemContextType {
  value: string;
}

// --- Contexts ---
const AccordionContext = createContext<AccordionContextType | undefined>(undefined);
const AccordionItemContext = createContext<AccordionItemContextType | undefined>(undefined);

// --- Components ---

interface AccordionProps {
  type?: AccordionType;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

const Accordion = ({ 
  type = 'single', 
  value: controlledValue, 
  defaultValue, 
  onValueChange, 
  collapsible = false, 
  children, 
  style 
}: AccordionProps) => {
  // Internal state for uncontrolled usage
  const [internalValue, setInternalValue] = useState<string | string[] | undefined>(
    defaultValue || (type === 'multiple' ? [] : undefined)
  );

  const value = controlledValue !== undefined ? controlledValue : internalValue;

  const handleValueChange = (itemValue: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (type === 'single') {
      const newValue = value === itemValue ? (collapsible ? '' : itemValue) : itemValue;
      setInternalValue(newValue);
      if (onValueChange) onValueChange(newValue);
    } else {
      // Multiple support
      let newValues = Array.isArray(value) ? [...value] : [];
      if (newValues.includes(itemValue)) {
        newValues = newValues.filter(v => v !== itemValue);
      } else {
        newValues.push(itemValue);
      }
      setInternalValue(newValues);
      if (onValueChange) onValueChange(newValues);
    }
  };

  return (
    <AccordionContext.Provider 
      value={{ 
        type, 
        value, 
        onValueChange: handleValueChange, 
        collapsible 
      }}
    >
      <View style={style}>{children}</View>
    </AccordionContext.Provider>
  );
};

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

const AccordionItem = ({ value, children, style }: AccordionItemProps) => {
  const theme = useTheme();
  return (
    <AccordionItemContext.Provider value={{ value }}>
      <View 
        style={[
          styles.item, 
          { borderBottomColor: theme.colors.outlineVariant },
          style
        ]}
      >
        {children}
      </View>
    </AccordionItemContext.Provider>
  );
};

interface AccordionTriggerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

const AccordionTrigger = ({ children, style, contentContainerStyle }: AccordionTriggerProps) => {
  const theme = useTheme();
  const accordionContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error("AccordionTrigger must be used within Accordion and AccordionItem");
  }

  const isOpen = Array.isArray(accordionContext.value) 
    ? accordionContext.value.includes(itemContext.value)
    : accordionContext.value === itemContext.value;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => accordionContext.onValueChange(itemContext.value)}
      style={[styles.trigger, style]}
    >
      <View style={[styles.triggerContent, contentContainerStyle]}>
        {typeof children === 'string' ? (
          <Text variant="titleMedium" style={{ fontWeight: '500', flex: 1 }}>
            {children}
          </Text>
        ) : (
          <View style={{ flex: 1 }}>{children}</View>
        )}
        <View 
          style={{ 
            transform: [{ rotate: isOpen ? '180deg' : '0deg' }],
            marginLeft: 8 
          }}
        >
          <Icon 
            source="chevron-down" 
            size={16} 
            color={theme.colors.onSurfaceVariant} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface AccordionContentProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

const AccordionContent = ({ children, style }: AccordionContentProps) => {
  const accordionContext = useContext(AccordionContext);
  const itemContext = useContext(AccordionItemContext);

  if (!accordionContext || !itemContext) {
    throw new Error("AccordionContent must be used within Accordion and AccordionItem");
  }

  const isOpen = Array.isArray(accordionContext.value) 
    ? accordionContext.value.includes(itemContext.value)
    : accordionContext.value === itemContext.value;

  if (!isOpen) return null;

  return (
    <View style={[styles.content, style]}>
      <View style={styles.contentInner}>
        {typeof children === 'string' ? (
          <Text variant="bodyMedium">{children}</Text>
        ) : (
          children
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
  },
  trigger: {
    paddingVertical: 16,
  },
  triggerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    overflow: 'hidden',
  },
  contentInner: {
    paddingBottom: 16,
    paddingTop: 0,
  }
});

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };