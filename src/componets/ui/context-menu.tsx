import React, { createContext, useContext, useState } from 'react';
import { View, TouchableOpacity, GestureResponderEvent, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Menu, Divider, Text, useTheme, Icon, Portal } from 'react-native-paper';

// --- Context ---
interface ContextMenuContextType {
  visible: boolean;
  anchor: { x: number; y: number };
  openMenu: (coordinates: { x: number; y: number }) => void;
  closeMenu: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextType | undefined>(undefined);

// --- Components ---

const ContextMenu = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });

  const openMenu = (coordinates: { x: number; y: number }) => {
    setAnchor(coordinates);
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

  return (
    <ContextMenuContext.Provider value={{ visible, anchor, openMenu, closeMenu }}>
      {children}
    </ContextMenuContext.Provider>
  );
};

const ContextMenuTrigger = ({ 
  children, 
  style, 
  disabled 
}: { 
  children: React.ReactNode; 
  style?: ViewStyle; 
  disabled?: boolean;
}) => {
  const context = useContext(ContextMenuContext);

  const handleLongPress = (event: GestureResponderEvent) => {
    if (disabled) return;
    const { pageX, pageY } = event.nativeEvent;
    context?.openMenu({ x: pageX, y: pageY });
  };

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      delayLongPress={500}
      activeOpacity={1}
      style={style}
    >
      {children}
    </TouchableOpacity>
  );
};

// Groups are semantic in Web, but in RN Paper Menu they are just flat children usually.
// We can wrap them in a View if needed, but Fragment is safer for Menu.Item rendering.
const ContextMenuGroup = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const ContextMenuPortal = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const ContextMenuContent = ({ 
  children, 
  style 
}: { 
  children: React.ReactNode; 
  style?: ViewStyle;
}) => {
  const context = useContext(ContextMenuContext);
  const theme = useTheme();

  if (!context) return null;

  return (
    <Portal>
      <Menu
        visible={context.visible}
        onDismiss={context.closeMenu}
        anchor={context.anchor}
        contentStyle={[{ backgroundColor: theme.colors.elevation.level2, minWidth: 220 }, style]}
      >
        {children}
      </Menu>
    </Portal>
  );
};

const ContextMenuItem = ({ 
  children, 
  onSelect, 
  inset, 
  disabled, 
  style 
}: { 
  children: React.ReactNode; 
  onSelect?: () => void; 
  inset?: boolean; 
  disabled?: boolean; 
  style?: ViewStyle;
}) => {
  const context = useContext(ContextMenuContext);
  
  return (
    <Menu.Item
      onPress={() => {
        onSelect?.();
        context?.closeMenu();
      }}
      title={children}
      disabled={disabled}
      contentStyle={[inset && { paddingLeft: 32 }, style]}
      dense
    />
  );
};

const ContextMenuCheckboxItem = ({ 
  children, 
  checked, 
  onSelect, 
  disabled, 
  style 
}: { 
  children: React.ReactNode; 
  checked?: boolean; 
  onSelect?: () => void; 
  disabled?: boolean; 
  style?: ViewStyle;
}) => {
  const context = useContext(ContextMenuContext);
  const theme = useTheme();

  return (
    <Menu.Item
      onPress={() => {
        onSelect?.();
        context?.closeMenu();
      }}
      title={children}
      disabled={disabled}
      leadingIcon={checked ? 'check' : undefined}
      contentStyle={style}
      dense
    />
  );
};

const ContextMenuRadioItem = ({ 
  children, 
  checked, 
  onSelect, 
  disabled, 
  style 
}: { 
  children: React.ReactNode; 
  checked?: boolean; 
  onSelect?: () => void; 
  disabled?: boolean; 
  style?: ViewStyle;
}) => {
  const context = useContext(ContextMenuContext);

  return (
    <Menu.Item
      onPress={() => {
        onSelect?.();
        context?.closeMenu();
      }}
      title={children}
      disabled={disabled}
      leadingIcon={checked ? 'circle-medium' : undefined} // 'circle-medium' represents the dot
      contentStyle={style}
      dense
    />
  );
};

const ContextMenuLabel = ({ 
  children, 
  inset, 
  style 
}: { 
  children: React.ReactNode; 
  inset?: boolean; 
  style?: TextStyle;
}) => {
  const theme = useTheme();
  return (
    <Text
      variant="labelSmall"
      style={[
        { 
          paddingHorizontal: 16, 
          paddingVertical: 8, 
          color: theme.colors.onSurfaceVariant,
          fontWeight: '600'
        },
        inset && { paddingLeft: 32 },
        style
      ]}
    >
      {children}
    </Text>
  );
};

const ContextMenuSeparator = ({ style }: { style?: ViewStyle }) => {
  return <Divider style={[{ marginVertical: 4 }, style]} />;
};

const ContextMenuShortcut = ({ 
  children, 
  style 
}: { 
  children: React.ReactNode; 
  style?: TextStyle;
}) => {
  const theme = useTheme();
  // Shortcuts in Paper Menu Items are tricky to position perfectly on the right 
  // without custom title views. We'll render it, but ideally it should be passed 
  // as a trailing element to a customized Menu Item if precise layout is needed.
  // Here we just return a Text component, but it might not align inside standard Menu.Item title string.
  // Best usage: Pass a View with Text and Shortcut to ContextMenuItem's children.
  return (
    <Text style={[{ marginLeft: 'auto', fontSize: 12, color: theme.colors.onSurfaceVariant }, style]}>
      {children}
    </Text>
  );
};

// --- Submenu Stubs ---
// Mobile Context Menus don't typically support nested cascading menus well.
// We provide these components to prevent crash, but they render flattened or simplified.

const ContextMenuSub = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const ContextMenuSubTrigger = ({ 
  children, 
  inset, 
  disabled 
}: { 
  children: React.ReactNode; 
  inset?: boolean; 
  disabled?: boolean;
}) => {
  // Renders as a disabled item with a chevron to indicate "there is more", 
  // but doesn't actually open it in this simple implementation.
  return (
    <Menu.Item
      onPress={() => {}}
      title={children}
      disabled={disabled}
      trailingIcon="chevron-right"
      contentStyle={inset ? { paddingLeft: 32 } : undefined}
      dense
    />
  );
};

const ContextMenuSubContent = ({ children }: { children: React.ReactNode }) => {
  // In a real implementation, this would need to open a new Menu.
  // Here we just render nothing to avoid cluttering the main menu with hidden items.
  return null; 
};

const ContextMenuRadioGroup = ({ 
  children, 
  value, 
  onValueChange 
}: { 
  children: React.ReactNode; 
  value?: string; 
  onValueChange?: (val: string) => void; 
}) => {
  // Inject value/onValueChange into children (RadioItems)
  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            checked: child.props.value === value,
            onSelect: () => onValueChange?.(child.props.value),
          });
        }
        return child;
      })}
    </>
  );
};

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
};