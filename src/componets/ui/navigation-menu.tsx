import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useId,
  useRef,
} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  LayoutAnimation,
  Platform,
  UIManager,
  ScrollView,
} from 'react-native';
import { Text, useTheme, Icon } from 'react-native-paper';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- Context ---
interface NavigationMenuContextType {
  value: string | null;
  setValue: (value: string | null) => void;
  registerContent: (value: string, content: React.ReactNode) => void;
  viewportContent: React.ReactNode | null;
}

const NavigationMenuContext = createContext<
  NavigationMenuContextType | undefined
>(undefined);

interface NavigationMenuItemContextType {
  value: string;
}

const NavigationMenuItemContext = createContext<
  NavigationMenuItemContextType | undefined
>(undefined);

// --- Components ---

interface NavigationMenuProps {
  children: React.ReactNode;
  style?: ViewStyle;
  value?: string;
  onValueChange?: (value: string) => void;
}

const NavigationMenu = React.forwardRef<View, NavigationMenuProps>(
  (
    { children, style, value: controlledValue, onValueChange, ...props },
    ref,
  ) => {
    const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
      null,
    );
    const [contentMap, setContentMap] = useState<
      Record<string, React.ReactNode>
    >({});

    const value =
      controlledValue !== undefined ? controlledValue : uncontrolledValue;

    const setValue = (newValue: string | null) => {
      // Animate transitions
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      if (onValueChange && newValue) {
        onValueChange(newValue);
      }
      if (controlledValue === undefined) {
        setUncontrolledValue(newValue);
      }
    };

    const registerContent = (itemValue: string, content: React.ReactNode) => {
      setContentMap(prev => ({ ...prev, [itemValue]: content }));
    };

    const viewportContent = value ? contentMap[value] : null;

    return (
      <NavigationMenuContext.Provider
        value={{ value, setValue, registerContent, viewportContent }}
      >
        <View ref={ref} style={[styles.root, style]} {...props}>
          {children}
        </View>
      </NavigationMenuContext.Provider>
    );
  },
);
NavigationMenu.displayName = 'NavigationMenu';

const NavigationMenuList = React.forwardRef<
  View,
  React.ComponentProps<typeof View>
>(({ style, children, ...props }, ref) => (
  <View ref={ref} style={[styles.list, style]} {...props}>
    {children}
  </View>
));
NavigationMenuList.displayName = 'NavigationMenuList';

const NavigationMenuItem = React.forwardRef<
  View,
  React.ComponentProps<typeof View> & { value?: string }
>(({ style, value: propValue, children, ...props }, ref) => {
  const autoId = useId();
  const value = propValue || autoId;

  return (
    <NavigationMenuItemContext.Provider value={{ value }}>
      <View ref={ref} style={[styles.item, style]} {...props}>
        {children}
      </View>
    </NavigationMenuItemContext.Provider>
  );
});
NavigationMenuItem.displayName = 'NavigationMenuItem';

const navigationMenuTriggerStyle = (theme: any, active: boolean) => ({
  backgroundColor: active ? theme.colors.elevation.level1 : 'transparent',
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 4,
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
});

const NavigationMenuTrigger = React.forwardRef<
  View,
  React.ComponentProps<typeof TouchableOpacity>
>(({ style, children, ...props }, ref) => {
  const context = useContext(NavigationMenuContext);
  const itemContext = useContext(NavigationMenuItemContext);
  const theme = useTheme();

  if (!context || !itemContext)
    throw new Error(
      'NavigationMenuTrigger must be used within NavigationMenu and NavigationMenuItem',
    );

  const isActive = context.value === itemContext.value;

  const handlePress = () => {
    const nextValue = isActive ? null : itemContext.value;
    context.setValue(nextValue);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[navigationMenuTriggerStyle(theme, isActive), style]}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {typeof children === 'string' ? (
          <Text style={{ fontWeight: '500', color: theme.colors.onSurface }}>
            {children}
          </Text>
        ) : (
          children
        )}
        <Icon
          source="chevron-down"
          size={16}
          color={theme.colors.onSurface}
          // We can animate rotation here if we turn Icon into Animated.View or wrapper
        />
      </View>
    </TouchableOpacity>
  );
});
NavigationMenuTrigger.displayName = 'NavigationMenuTrigger';

const NavigationMenuContent = React.forwardRef<
  View,
  React.ComponentProps<typeof View>
>(({ children, ...props }, ref) => {
  const context = useContext(NavigationMenuContext);
  const itemContext = useContext(NavigationMenuItemContext);

  if (!context || !itemContext)
    throw new Error(
      'NavigationMenuContent must be used within NavigationMenu and NavigationMenuItem',
    );

  // Register content to the parent context
  useEffect(() => {
    context.registerContent(itemContext.value, children);
  }, [children, itemContext.value]);

  // This component itself doesn't render anything in place in the list,
  // it effectively "teleports" to the Viewport via the context state.
  return null;
});
NavigationMenuContent.displayName = 'NavigationMenuContent';

const NavigationMenuLink = React.forwardRef<
  TouchableOpacity,
  React.ComponentProps<typeof TouchableOpacity>
>(({ style, children, ...props }, ref) => {
  const theme = useTheme();
  return (
    <TouchableOpacity ref={ref} style={[styles.link, style]} {...props}>
      {typeof children === 'string' ? (
        <Text style={{ color: theme.colors.onSurface }}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
});
NavigationMenuLink.displayName = 'NavigationMenuLink';

const NavigationMenuViewport = React.forwardRef<
  View,
  React.ComponentProps<typeof View>
>(({ style, ...props }, ref) => {
  const context = useContext(NavigationMenuContext);
  const theme = useTheme();

  if (!context)
    throw new Error(
      'NavigationMenuViewport must be used within NavigationMenu',
    );

  if (!context.viewportContent) return null;

  return (
    <View
      ref={ref}
      style={[
        styles.viewport,
        {
          backgroundColor: theme.colors.elevation.level3,
          borderColor: theme.colors.outlineVariant,
        },
        style,
      ]}
      {...props}
    >
      <ScrollView style={{ maxHeight: 300 }}>
        {context.viewportContent}
      </ScrollView>
    </View>
  );
});
NavigationMenuViewport.displayName = 'NavigationMenuViewport';

const NavigationMenuIndicator = React.forwardRef<
  View,
  React.ComponentProps<typeof View>
>(({ style, ...props }, ref) => {
  // Complex indicator animations are hard to replicate perfectly without shared values.
  // We render a simple indicator if active.
  const context = useContext(NavigationMenuContext);
  if (!context?.value) return null;

  return (
    <View ref={ref} style={[styles.indicator, style]} {...props}>
      <View style={styles.indicatorInner} />
    </View>
  );
});
NavigationMenuIndicator.displayName = 'NavigationMenuIndicator';

// --- Styles ---

const styles = StyleSheet.create({
  root: {
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4, // space-x-1
  },
  item: {
    // Navigation items wrapper
  },
  viewport: {
    position: 'absolute',
    top: '100%', // top-full
    marginTop: 6, // mt-1.5
    width: '100%', // w-full for mobile, usually restricted width on desktop
    maxWidth: 350, // Limit width for aesthetic on tablets
    borderRadius: 8, // rounded-md
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  link: {
    padding: 12,
    width: '100%',
  },
  indicator: {
    position: 'absolute',
    top: '100%',
    height: 6, // h-1.5
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    zIndex: 1,
  },
  indicatorInner: {
    width: 12,
    height: 12,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'white', // Should match border/bg of viewport
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    marginTop: 8, // Offset to show only top half
  },
});

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
};
