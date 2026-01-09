import React, { createContext, useContext, useState, useRef } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Menu, Divider, Text, useTheme, Portal } from 'react-native-paper';

// --- Context ---
interface MenubarMenuContextType {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  anchor: { x: number; y: number } | null;
  setAnchor: (layout: { x: number; y: number } | null) => void;
}

const MenubarMenuContext = createContext<MenubarMenuContextType | undefined>(undefined);

// --- Components ---

const Menubar = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, children, ...props }, ref) => {
    const theme = useTheme();
    return (
      <View
        ref={ref}
        style={[
          styles.menubar,
          { 
            backgroundColor: theme.colors.background, 
            borderColor: theme.colors.outlineVariant 
          },
          style
        ]}
        {...props}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {children}
        </ScrollView>
      </View>
    );
  }
);
Menubar.displayName = "Menubar";

const MenubarMenu = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState<{ x: number; y: number } | null>(null);

  return (
    <MenubarMenuContext.Provider value={{ visible, setVisible, anchor, setAnchor }}>
      <View style={{ flexDirection: 'column' }}>
        {children}
      </View>
    </MenubarMenuContext.Provider>
  );
};

const MenubarTrigger = React.forwardRef<View, React.ComponentProps<typeof TouchableOpacity>>(
  ({ style, children, ...props }, ref) => {
    const context = useContext(MenubarMenuContext);
    const theme = useTheme();
    const triggerRef = useRef<View>(null);

    if (!context) throw new Error("MenubarTrigger must be used within MenubarMenu");

    // Helper to handle refs
    const setRef = (node: View | null) => {
        triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<View | null>).current = node;
    };

    const handlePress = () => {
        if (!context.visible && triggerRef.current) {
            triggerRef.current.measure((x, y, width, height, pageX, pageY) => {
                context.setAnchor({ x: pageX, y: pageY + height });
                context.setVisible(true);
            });
        } else {
            context.setVisible(!context.visible);
        }
    };

    return (
      <View
        ref={setRef}
        collapsable={false}
      >
        <TouchableOpacity
          style={[
            styles.trigger, 
            context.visible && { backgroundColor: theme.colors.elevation.level1 },
            style
          ]}
          onPress={handlePress}
          activeOpacity={0.7}
          {...props}
        >
          {typeof children === 'string' ? (
             <Text style={{ fontWeight: '500', color: theme.colors.onSurface }}>{children}</Text>
          ) : children}
        </TouchableOpacity>
      </View>
    );
  }
);
MenubarTrigger.displayName = "MenubarTrigger";

const MenubarPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const MenubarContent = React.forwardRef<View, React.ComponentProps<typeof View>>(
  ({ style, children, ...props }, ref) => {
    const context = useContext(MenubarMenuContext);
    const theme = useTheme();

    if (!context) throw new Error("MenubarContent must be used within MenubarMenu");

    return (
      <Portal>
        <Menu
          visible={context.visible}
          onDismiss={() => context.setVisible(false)}
          anchor={context.anchor || { x: 0, y: 0 }}
          contentStyle={[
             styles.content,
             { backgroundColor: theme.colors.elevation.level2 },
             style
          ]}
        >
          {children}
        </Menu>
      </Portal>
    );
  }
);
MenubarContent.displayName = "MenubarContent";

const MenubarItem = React.forwardRef<View, any>(
  ({ children, inset, style, disabled, onSelect, ...props }, ref) => {
    const context = useContext(MenubarMenuContext);
    
    return (
      <Menu.Item
        ref={ref}
        onPress={() => {
            onSelect?.();
            context?.setVisible(false);
        }}
        title={children}
        disabled={disabled}
        contentStyle={[inset && { paddingLeft: 32 }, style]}
        dense
        {...props}
      />
    );
  }
);
MenubarItem.displayName = "MenubarItem";

const MenubarCheckboxItem = React.forwardRef<View, any>(
  ({ children, checked, disabled, onSelect, style, ...props }, ref) => {
    const context = useContext(MenubarMenuContext);
    
    return (
      <Menu.Item
        ref={ref}
        onPress={() => {
            onSelect?.();
            context?.setVisible(false);
        }}
        title={children}
        disabled={disabled}
        leadingIcon={checked ? 'check' : undefined}
        contentStyle={style}
        dense
        {...props}
      />
    );
  }
);
MenubarCheckboxItem.displayName = "MenubarCheckboxItem";

const MenubarRadioItem = React.forwardRef<View, any>(
  ({ children, checked, disabled, onSelect, style, ...props }, ref) => {
    const context = useContext(MenubarMenuContext);
    
    return (
      <Menu.Item
        ref={ref}
        onPress={() => {
            onSelect?.();
            context?.setVisible(false);
        }}
        title={children}
        disabled={disabled}
        leadingIcon={checked ? 'circle-medium' : undefined}
        contentStyle={style}
        dense
        {...props}
      />
    );
  }
);
MenubarRadioItem.displayName = "MenubarRadioItem";

const MenubarLabel = React.forwardRef<any, any>(
  ({ children, inset, style, ...props }, ref) => {
    const theme = useTheme();
    return (
      <Text
        ref={ref}
        variant="labelSmall"
        style={[
            styles.label,
            { color: theme.colors.onSurfaceVariant },
            inset && { paddingLeft: 32 },
            style
        ]}
        {...props}
      >
        {children}
      </Text>
    );
  }
);
MenubarLabel.displayName = "MenubarLabel";

const MenubarSeparator = React.forwardRef<View, any>(
  ({ style, ...props }, ref) => {
    return <Divider ref={ref} style={[styles.separator, style]} {...props} />;
  }
);
MenubarSeparator.displayName = "MenubarSeparator";

const MenubarShortcut = ({ children, style }: { children: React.ReactNode, style?: TextStyle }) => {
    const theme = useTheme();
    return (
        <Text style={[styles.shortcut, { color: theme.colors.onSurfaceVariant }, style]}>
            {children}
        </Text>
    );
};

// --- Submenu Stubs ---

const MenubarGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const MenubarSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const MenubarSubTrigger = ({ children, inset }: { children: React.ReactNode, inset?: boolean }) => {
    return (
        <Menu.Item
            title={children}
            trailingIcon="chevron-right"
            contentStyle={inset ? { paddingLeft: 32 } : undefined}
            dense
        />
    );
};

const MenubarSubContent = ({ children }: { children: React.ReactNode }) => null;

const MenubarRadioGroup = ({ children, value, onValueChange }: any) => {
    return (
        <>
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    // Type assertion to access props safely
                    const childElement = child as React.ReactElement<any>;
                    return React.cloneElement(childElement, {
                        checked: childElement.props.value === value,
                        onSelect: () => onValueChange?.(childElement.props.value),
                    });
                }
                return child;
            })}
        </>
    );
};

// --- Styles ---

const styles = StyleSheet.create({
  menubar: {
    flexDirection: 'row',
    height: 48, 
    alignItems: 'center',
    borderRadius: 8, 
    borderWidth: 1,
    padding: 4, 
  },
  trigger: {
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    borderRadius: 4, 
    marginRight: 4,
  },
  content: {
    minWidth: 192, 
    borderRadius: 8, 
  },
  label: {
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    fontWeight: '600',
  },
  separator: {
    marginVertical: 4, 
  },
  shortcut: {
    fontSize: 12,
    letterSpacing: 1,
    marginLeft: 'auto',
  }
});

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
};